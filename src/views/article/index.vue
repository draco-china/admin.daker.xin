<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <markdown-editor v-model="article.content" :configs="configs" style="height: 100%" preview-class="markdown-body"
                         ref="markdownEditor"></markdown-editor>
      </el-col>
      <el-col :span="6">
        <el-form size="mini">
          <el-form-item>
            <el-button type="success" icon="el-icon-check" round @click="create">
              <span v-if="!article._id">保存并发布</span>
              <span v-else>修改并发布</span>
            </el-button>
            <el-button type="danger" icon="el-icon-delete" round @click="clear">清空</el-button>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="article.state" filterable placeholder="请选择" style="width: 100%">
              <el-option label="回收站" :value="-1"></el-option>
              <el-option label="草稿" :value="0"></el-option>
              <el-option label="已发布" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="article.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="article.description" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="缩略图">
            <!--<el-input v-model="article.thumb"></el-input>-->
            <el-upload drag accept="image/*" :show-file-list="false" action="" :http-request="singleFile">
              <img v-if="article.thumb" :src="article.thumb" class="avatar">
              <div v-else class="el-upload__text">
                <span><em>拖拽上传</em> 或 <em>点击上传</em><br>图片比例为5:3</span>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="article.category" filterable placeholder="请选择类别" style="width: 100%">
              <el-option v-for="item in category" :key="item._id" :label="item.name" :value="item._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="article.tag" multiple placeholder="请选择标签" style="width: 100%">
              <el-option v-for="item in tag" :key="item._id" :label="item.name" :value="item._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="keywords" placeholder='多个请用 “ , ” 隔开'></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import UploadApi from '@/api/upload'
  import ArticleApi from '@/api/article'
  export default {
    data() {
      return {
        keywords: '',
        article: {
          category: null,
          title: null,
          keywords: null,
          descriptionL: null,
          tag: [],
          thumb: null,
          content: null,
          state: 1
        },
        configs: {
          spellChecker: false, // 禁用拼写检查
          status: false, // 禁用底部状态栏
          renderingConfig: {
            codeSyntaxHighlighting: true // 开启代码高亮
          }
        }
      }
    },
    computed: {
      icon() {
        return this.$store.state.app.icon
      },
      tag() {
        return this.$store.state.tag.data
      },
      category() {
        return this.$store.state.category.data
      },
      simplemde() {
        return this.$refs.markdownEditor.simplemde
      }
    },
    beforeRouteEnter(to, from, next) {
      if (to.query.articleId) {
        ArticleApi.get(to.query.articleId).then(res => {
          next(vm => {
            vm.article = res.result
            vm.keywords = vm.article.keywords.join(',')
          })
        })
      } else {
        next()
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.query.articleId) {
        ArticleApi.get(to.query.articleId).then(res => {
          this.article = res.result
          this.keywords = this.article.keywords.join(',')
        })
      } else {
        this.keywords = ''
        this.article = {
          category: null,
          title: null,
          keywords: null,
          descriptionL: null,
          tag: [],
          thumb: null,
          content: null,
          state: 1
        }
        next()
      }
    },
    mounted() {
      // vue-simplemde 扩展
      window.addEventListener('drop', e => {
        e = e || event
        if (e.target.className === 'CodeMirror-scroll') { // 如果进入到编辑器的话，将阻止默认事件
          e.preventDefault()
        }
      }, false)
      const simplemde = this.$refs.markdownEditor.simplemde
      this.$nextTick(() => {
        simplemde.codemirror.on('drop', (editor, e) => {
          if (!(e.dataTransfer && e.dataTransfer.files)) {
            return this.$message({
              message: '此浏览器不支持图片拖拽',
              type: 'error'
            })
          }
          const dataList = e.dataTransfer.files
          const imageFiles = [] // 要上传的文件实例数组
          // 循环，是因为可能会同时拖动几个图片文件
          for (let i = 0; i < dataList.length; i++) {
            // 如果不是图片，则弹窗警告 仅支持拖拽图片文件
            if (dataList[i].type.indexOf('image') === -1) {
              // 下面的continue，作用是，如果用户同时拖动2个图片和一个文档，那么文档不给于上传，图片照常上传。
              continue
            }
            // 先把当前的文件push进数组里，等for循环结束之后，统一上传。
            imageFiles.push(dataList[i])
          }
          // uploadImagesFile方法是上传图片的方法
          // simplemde.codemirror的作用是用于区分当前的图片上传是处于哪个编辑框
          this.uploadImagesFile(simplemde.codemirror, imageFiles)
          // 因为已经有了下面这段代码，所以上面的屏蔽默认事件代码就不用写了
          e.preventDefault()
        })
        simplemde.codemirror.on('paste', (editor, e) => { // 粘贴图片的触发函数
          if (!(e.clipboardData && e.clipboardData.items)) {
            // 弹窗说明，此浏览器不支持此操作
            return this.$message({
              message: '此浏览器不支持图片粘贴',
              type: 'error'
            })
          }
          try {
            const dataList = e.clipboardData.items
            if (dataList[0].kind === 'file' && dataList[0].getAsFile().type.indexOf('image') !== -1) {
              this.uploadImagesFile(simplemde.codemirror, [dataList[0].getAsFile()])
            }
          } catch (e) {
            // 弹窗说明，只能粘贴图片
            return this.$message({
              message: '只能粘贴图片',
              type: 'error'
            })
          }
        })
      })
    },
    methods: {
      singleFile(params) {
        // 加载图片获取图片真实宽度和高度
        // const image = new Image()
        // image.onload = () => {
        //   const width = image.width
        //   const height = image.height
        //   if (width / 5 === height / 3) {
        //     return true
        //   } else {
        //     this.$message.error('上传的图片比例必须为 5:3 !')
        //   }
        // }
        // image.src = URL.createObjectURL(file)
        const isLt2M = params.file.size / 1024 / 1024 < 2

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return isLt2M
        }

        const formData = new FormData()
        formData.append('file', params.file)
        UploadApi.singleFile(formData).then(res => {
          this.article.thumb = res.result.path
        })
      },
      uploadImagesFile(simplemde, files) {
        // 把每个文件实例使用FormData进行包装一下，然后返回一个数组
        const formData = new FormData()
        files.map(file => {
          formData.append('file', file)
        })
        UploadApi.multerFile(formData).then(res => {
          res.result.fileList.map(item => {
            const url = `![](${location.origin + item.path})` // 拼接成markdown语法
            const content = simplemde.getValue()
            simplemde.setValue(content + url + '\n') // 和编辑框之前的内容进行拼接
          })
        })
      },
      create() {
        this.article.keywords = this.keywords.split(',')
        if (!this.article._id) {
          ArticleApi.create(this.article).then(res => {
            if (res.success) {
              this.$router.push('/article/list')
            }
          })
        } else {
          ArticleApi.update(this.article._id, this.article).then(res => {
            if (res.success) {
              this.$router.push('/article/list')
            }
          })
        }
      },
      clear() {
        this.keywords = ''
        this.article = {
          category: null,
          title: null,
          keywords: null,
          descriptionL: null,
          tag: [],
          thumb: null,
          content: '',
          state: 1
        }
      }
    }
  }

</script>

<style lang="scss">
  .CodeMirror-wrap pre {
    line-height: 1.25;
  }

  .CodeMirror {
    height: calc(100vh - 158px);
  }
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 0;
      padding-bottom: 60%;
      overflow: hidden;
    }
    .el-upload__text {
      margin-top: 15%;
    }
    img {
      width: 100%;
    }
  }
</style>

