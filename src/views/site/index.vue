<template>
  <div class="app-container site">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card>
          <div slot="header" class="clearfix">
            <span>全局设置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="saveSite">保存</el-button>
          </div>
          <el-form :model="site" :rules="rules" size="small">
            <el-form-item label="网站标题" prop="title">
              <el-input v-model="site.title"></el-input>
            </el-form-item>
            <el-form-item label="网站副标题" prop="sub_title">
              <el-input v-model="site.sub_title"></el-input>
            </el-form-item>
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="site.keywords"></el-input>
            </el-form-item>
            <el-form-item label="网站描述" prop="description">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="site.description"></el-input>
            </el-form-item>
            <el-form-item label="站点地址" prop="site_url">
              <el-input v-model="site.site_url"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="site_email">
              <el-input v-model="site.site_email"></el-input>
            </el-form-item>
            <el-form-item label="备案号" prop="site_icp">
              <el-input v-model="site.site_icp"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            <span>用户设置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="saveUser">保存</el-button>
          </div>
          <el-form :model="user" :rules="rules" size="small">
            <el-form-item label="头像" prop="gravatar">
              <div class="avatar">
                <el-upload class="avatar-uploader" drag accept="image/*" :show-file-list="false" action="" :http-request="singleFile">
                  <img v-if="user.gravatar" :src="user.gravatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="签名" prop="slogan">
              <el-input v-model="user.slogan"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="user.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
              <el-input v-model="user.new_password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="repeat_password">
              <el-input v-model="user.repeat_password" type="password"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SiteApi from '@/api/site'
  import UserApi from '@/api/user'
  import UploadApi from '@/api/upload'

  export default {
    data() {
      return {
        site: {
          title: '',
          sub_title: '',
          keywords: '',
          description: '',
          site_url: '',
          site_email: '',
          site_icp: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入网站标题', trigger: 'blur' }
          ],
          sub_title: [
            { required: true, message: '请输入网站副标题', trigger: 'blur' }
          ],
          site_url: [
            { required: true, message: '请输入站点', trigger: 'blur' }
          ],
          site_email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          gravatar: [
            { required: true, message: '请上传头像', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          new_password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          repeat_password: [
            { required: true, message: '请重复新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ]
        },
        user: {
          gravatar: '',
          username: '',
          slogan: '',
          password: '',
          new_password: '',
          repeat_password: ''
        }
      }
    },
    created() {
      this.getSite()
      this.getUser()
    },
    methods: {
      getSite() {
        SiteApi.get().then(res => {
          res.result.keywords = res.result.keywords.join(',')
          this.site = res.result
        })
      },
      saveSite() {
        const params = JSON.parse(JSON.stringify(this.site))
        params.keywords = this.site.keywords.split(',')
        SiteApi.update(params).then(res => {
          res.result.keywords = res.result.keywords.join(',')
          this.site = res.result
        })
      },
      getUser() {
        UserApi.get().then(res => {
          this.user.gravatar = res.result.gravatar
          this.user.username = res.result.username
          this.user.slogan = res.result.slogan
        })
      },
      saveUser() {
        UserApi.update(this.user).then(res => {
          this.user.gravatar = res.result.gravatar
          this.user.username = res.result.username
          this.user.slogan = res.result.slogan
          this.user.password = ''
          this.user.new_password = ''
          this.user.repeat_password = ''
        })
      },
      singleFile(params) {
        const isLt2M = params.file.size / 1024 / 1024 < 2

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return isLt2M
        }

        const formData = new FormData()
        formData.append('file', params.file)
        UploadApi.singleFile(formData).then(res => {
          this.user.gravatar = res.result.path
        })
      }
    }
  }
</script>

<style>
  .avatar-uploader {
    display: block;
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload-dragger {
    width: 178px;
    height: 178px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    margin-bottom: 33px;
  }
</style>
