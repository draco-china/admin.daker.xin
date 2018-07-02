<template>
  <main-layout :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange">>
    <template slot="header">
      <el-input placeholder="可根据标题、文章内容、描述进行搜索" v-model="keyword" class="input-with-select" size="small">
        <el-button slot="append" icon="el-icon-search" @click="get"></el-button>
      </el-input>
    </template>
    <template slot-scope="props">
      <el-table :data="list" style="width: 100%" :height="props.height">
        <el-table-column prop="title" label="标题">
          <template slot-scope="scope">
            <router-link :to="`/article?articleId=${scope.row._id}`">
              <el-button type="text">{{scope.row.title}}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="类别" width="120" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.category">
              <i :class="`iconfont ${scope.row.category.icon}`"/> {{scope.row.category.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-left: 5px;" v-for="(item, index) in scope.row.tag" :key="index">
              <i :class="`iconfont ${item.icon}`" /> {{item.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini">
              <span v-if="scope.row.state == -1">回收站</span>
              <span v-if="scope.row.state == 0">草稿</span>
              <span v-if="scope.row.state == 1">发布</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.create_at | toLocalString}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meta.comments" label="评论" align="center"></el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.state != 1" @click="patch(scope.row, 1)" round>发布</el-button>
            <el-button type="warning" size="mini" v-if="scope.row.state != 0" @click="patch(scope.row, 0)" round>移至草稿</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.state != -1" @click="patch(scope.row, -1)" round>移至回收站</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </main-layout>
</template>

<script>
import ArticleApi from '@/api/article'

export default {
  data() {
    return {
      keyword: '',
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
  mounted() {
    this.get()
  },
  methods: {
    get() {
      ArticleApi.getList(this.pagination.currentPage, this.pagination.pageSize, this.keyword).then(res => {
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
    patch(row, state) {
      ArticleApi.patch({ id: row._id, state }).then(res => {
        if (res.success) {
          row.state = state
        }
      })
    }
    // update() {
    //   CategoryApi.update(this.category._id, this.category.icon, this.category.name, this.category.description, this.category.category).then(res => {
    //     this.list.splice(this.list.findIndex(item => item._id === res.result._id), 1, res.result)
    //     this.category._id = null
    //   })
    // },
    // remove(id) {
    //   CategoryApi.delete(id).then(res => {
    //     this.get()
    //   })
    // }
  }
}
</script>

<style lang="scss">
  .el-button {
    margin-top: 5px;
  }

</style>

