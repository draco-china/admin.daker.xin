<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <markdown-editor v-model="article.content" :configs="configs" preview-class="markdown-body"
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
            <el-upload drag accept="image/*" :show-file-list="false" action="" :http-request="readImage">
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
            <el-input v-model="article.keywords" placeholder='多个请用 “ , ” 隔开'></el-input>
          </el-form-item>
        </el-form>
        <el-dialog title="图片裁剪" :visible.sync="cropperIsShow" width="1088px" center>
          <div class="cropper-box">
            <vue-cropper
              ref="cropper"
              :img="option.img"
              :outputType="option.outputType"
              :info="option.info"
              :full="option.full"
              :canScale="option.canScale"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              @realTime="realTime"
            ></vue-cropper>
          </div>
          <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
          <div style="visibility: hidden; position: absolute; z-index: -1; left: 0; top: 0;">
            <canvas :width="originalImgData.width" :height="originalImgData.height" ref="preview"></canvas>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cropperIsShow = false">取 消</el-button>
            <el-button type="primary" @click="submitFile">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropper'
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
        },
        cropperIsShow: false,
        option: {
          img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          info: true,
          full: true,
          outputType: 'png',
          canMove: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 500,
          autoCropHeight: 300,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [5, 3]
        },
        previews: {},
        originalImgData: {
          src: '',
          name: '',
          type: '',
          width: 1200,
          height: 720
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
    components: {
      VueCropper
    },
    beforeRouteEnter(to, from, next) {
      if (to.query.articleId) {
        ArticleApi.get(to.query.articleId).then(res => {
          next(vm => {
            res.result.keywords = res.result.keywords.join(',')
            vm.article = res.result
          })
        })
      } else {
        next()
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.query.articleId) {
        ArticleApi.get(to.query.articleId).then(res => {
          res.result.keywords = res.result.keywords.join(',')
          this.article = res.result
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
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      // 提交图片
      submitFile() {
        this.$refs.cropper.getCropBlob((data) => {
          const canvas = this.$refs.preview
          const ctx = canvas.getContext('2d')
          const image = new Image()
          image.src = URL.createObjectURL(data)
          image.onload = () => {
            this.originalImgData.src = image.src
            // 清空画布
            ctx.clearRect(0, 0, this.originalImgData.width, this.originalImgData.height)
            ctx.save()
            ctx.drawImage(image, 0, 0, this.originalImgData.width, this.originalImgData.height)

            // 添加文字水印
            ctx.font = '24px Microsoft YaHei'
            ctx.fillStyle = 'rgba(255, 255, 255, .25)'
            // 获取文字宽度
            const SAPN = document.createElement('span')
            SAPN.innerHTML = 'daker.xin'
            SAPN.setAttribute('id', 'span')
            SAPN.setAttribute('style', 'font-size: 24px; font-family: Microsoft YaHei; visibility: hidden; display: inline-block;')
            document.body.appendChild(SAPN)
            const ELE = document.getElementById('span')
            ctx.fillText('daker.xin', 1200 - ELE.clientWidth - 12, 720 - ELE.clientHeight / 2)
            document.getElementById('span').remove()
            ctx.restore()
            canvas.toBlob(blob => {
              const name = Date.now()
              const files = new window.File([blob], name + '-file.png', { type: this.originalImgData.type || 'png' })
              const formData = new FormData()
              formData.append('file', files)
              UploadApi.singleFile(formData).then(res => {
                this.article.thumb = res.result.path
                this.$refs.cropper.refresh()
                this.cropperIsShow = false
              })
            })
          }
        })
      },
      // 上传读取 并开始裁剪
      readImage(params) {
        this.option.img = URL.createObjectURL(params.file)
        this.originalImgData.name = params.file.name
        this.originalImgData.type = params.file.type
        this.cropperIsShow = true
      },
      uploadImagesFile(simplemde, files) {
        // 把每个文件实例使用FormData进行包装一下，然后返回一个数组
        const formData = new FormData()
        files.map(file => {
          formData.append('file', file)
        })
        UploadApi.multerFile(formData).then(res => {
          res.result.fileList.map(item => {
            const url = `![](${item.path})` // 拼接成markdown语法
            const content = simplemde.getValue()
            simplemde.setValue(content + url + '\n') // 和编辑框之前的内容进行拼接
          })
        })
      },
      create() {
        const params = JSON.parse(JSON.stringify(this.article))
        params.keywords = this.site.keywords.split(',')
        if (!this.article._id) {
          ArticleApi.create(params).then(res => {
            if (res.success) {
              this.$router.push('/article/list')
            }
          })
        } else {
          ArticleApi.update(this.article._id, params).then(res => {
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
  .cropper-box {
    width: 500px;
    height: 500px;
    display: inline-block;
    vertical-align: top;
    margin-right: 30px;
  }
  .show-preview {
    display: inline-block;
    vertical-align: top;
    margin: 0!important;
    border: 1px dashed #39f;
  }
  .dialog-footer {
    clear: both;
  }
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-dialog.el-dialog--center {
    margin-top: 0!important;
  }
</style>

