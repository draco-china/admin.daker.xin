<template>
  <main-layout :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange">>
    <template slot="header">
      <el-row>
        <el-col :span="24">
          <el-form :model="add" :inline="true" size="mini">
            <el-form-item label="图标">
              <template slot="label">
                图标 <i :class="`iconfont ${add.icon}`"></i>
              </template>
              <el-select v-model="add.icon" filterable placeholder="请选择">
                <el-option
                  v-for="item in icon"
                  :key="item"
                  :label="item"
                  :value="item">
                  <i :class="`iconfont ${item}`"></i>
                  <span>{{item}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="add.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="链接">
              <el-input v-model="add.slug" placeholder="请输入链接" clearable></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="add.description" placeholder="请输入描述" type="textarea" autosize></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="create">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-input placeholder="请输入名称或描述" v-model="keyword" class="input-with-select" size="small">
            <el-button slot="append" icon="el-icon-search" @click="get"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </template>
    <template slot-scope="props">
      <el-table :data="list" style="width: 100%" :height="props.height"
                @row-click="row => {tag = { _id: row._id, icon: row.icon, name: row.name, slug: row.slug, description: row.description }}">
        <el-table-column prop="name" label="名称" width="160">
          <template slot-scope="scope">
            <el-button type="text" v-if="tag._id != scope.row._id" :icon="`iconfont ${scope.row.icon}`"> {{scope.row.name}}</el-button>
            <div v-else>
              图标：
              <el-select v-model="tag.icon" size="mini" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in icon" :key="item" :label="item" :value="item">
                  <i :class="`iconfont ${item}`"></i> <span>{{item}}</span>
                </el-option>
              </el-select>
              名称：
              <el-input  v-model="tag.name" size="mini" clearable style="width: 100%"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="slug" label="链接">
          <template slot-scope="scope">
            <el-button type="text" v-if="tag._id != scope.row._id">{{scope.row.slug}}</el-button>
            <el-input  v-else v-model="tag.slug" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            <el-button type="text" v-if="tag._id != scope.row._id">{{scope.row.description}}</el-button>
            <el-input  v-else v-model="tag.description" size="mini" type="textarea" autosize></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="articleTotal" label="文章数量" align="center" width="120"></el-table-column>
        <el-table-column label="操作" align="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit"  v-if="tag._id == scope.row._id" @click.stop="update"></el-button>
            <el-button type="text" icon="error el-icon-delete" @click.stop="remove(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </main-layout>
</template>

<script>
import TagApi from '@/api/tag'

export default {
  data() {
    return {
      keyword: '',
      add: {
        icon: null,
        name: null,
        slug: null,
        description: null
      },
      tag: {
        _id: null,
        icon: null,
        name: null,
        slug: null,
        description: null
      },
      list: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  computed: {
    icon() {
      return this.$store.state.app.icon
    }
  },
  created() {
    this.get()
  },
  methods: {
    create() {
      TagApi.create(this.add).then(res => {
        this.add = {
          icon: null,
          name: null,
          description: null
        }
        this.get()
      })
    },
    get() {
      TagApi.get(this.pagination.currentPage, this.pagination.pageSize, this.keyword).then(res => {
        this.list = res.result.list
        this.pagination = res.result.pagination
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.get()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.get()
    },
    update() {
      TagApi.update(this.tag).then(res => {
        this.list.splice(this.list.findIndex(item => item._id === res.result._id), 1, res.result)
        this.tag._id = null
      })
    },
    remove(id) {
      TagApi.delete(id).then(res => {
        this.get()
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

