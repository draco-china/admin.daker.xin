<template>
  <main ref="container" id="container" class="layout-container">
    <h5 v-if="title">{{title}}</h5>
    <header v-if="header">
      <slot name="header">
        <div class="tabs-hd">
          <div class="tab-left">
            <el-tabs v-model="active" @tab-click="handleClick">
              <el-tab-pane label="全部" name="all"></el-tab-pane>
              <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.name" :name="item.id"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="tab-right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-tooltip class="item" effect="dark" content="更多" placement="top">
                  <el-button type="text"><i class="el-icon-more"></i></el-button>
                </el-tooltip>
              </span>
              <el-dropdown-menu slot="dropdown">
                <a @click="handleNew"><el-dropdown-item><i class="el-icon-plus"/> 新建</el-dropdown-item></a>
                <a @click="handleEdit"><el-dropdown-item ><i class="el-icon-edit"/> 编辑</el-dropdown-item></a>
                <a @click="handleDel"><el-dropdown-item><i class="el-icon-delete"/> 删除</el-dropdown-item></a>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="action">
          <div class="search">
            <el-input placeholder="请输入" v-model="search.value" class="input-with-select">
              <el-select v-model="search.select" slot="prepend" placeholder="请选择" style="width: 90px">
                <el-option v-for="(item, index) in option" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-input>
          </div>
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
            <el-button type="text" @click="handleAdd"><i class="icon el-icon-plus"/></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button type="text" @click="handleRefresh"><i class="icon el-icon-refresh"/></el-button>
          </el-tooltip>
        </div>
      </slot>
    </header>
    <div ref="section" id="section" :style="`height: ${height}px`">
      <slot :height="height"></slot>
    </div>
    <footer v-if="footer" class="pagination-footer">
      <slot name="footer">
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </slot>
    </footer>
  </main>
</template>

<script>
export default {
  data() {
    return {
      height: 500,
      resizeTimeout: '',
      active: this.tabId,
      search: {
        value: '',
        select: this.option[0].value
      }
    }
  },
  props: {
    // 是否开启头部
    header: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // tab切换后的id值
    tabId: {
      type: String,
      default: 'all'
    },
    // tabs列表
    tabList: {
      type: Array,
      default: () => {
        return [{
          id: 'button 1',
          name: 'button 1'
        }]
      }
    },
    // 搜索条件
    option: {
      type: Array,
      default: () => {
        return [{
          label: '示例',
          value: '示例'
        }]
      }
    },
    // 是否开启footer
    footer: {
      type: Boolean,
      default: true
    },
    // 分页
    pagination: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleResize()
      window.addEventListener('resize', () => { this.handleResize() }, false)
    })
  },
  watch: {
    tabId() {
      this.active = this.tabId
    },
    search: {
      handler: function() {
        this.handleSearch()
      },
      deep: true
    }
  },
  methods: {
    // 窗口改变重新计算section容器高度
    handleResize() {
      if (!this.resizeTimeout && this.$refs.container && this.$refs.section) {
        this.resizeTimeout = setTimeout(() => {
          this.resizeTimeout = null
          const container = this.$refs.container.getBoundingClientRect()
          const section = this.$refs.section.getBoundingClientRect()
          this.height = container.height - section.top + container.top - (this.footer ? 40 : 0)
        }, 66)
      }
    },
    // header头部tab切换
    handleClick(tab) {
      this.$emit('tab-click', tab)
    },
    /**
     * 点击新建按钮时触发
     */
    handleNew() {
      this.$emit('new')
    },
    /**
     * 点击编辑按钮时触发
     */
    handleEdit() {
      if (this.tabId === 'all') {
        return this.$message({
          type: 'info',
          message: '该组不能编辑'
        })
      }
      this.$emit('edit', this.tabList.filter(item => item.id === this.tabId)[0])
    },
    /**
     * 点击删除按钮时触发
     */
    handleDel() {
      if (this.tabId === 'all') {
        return this.$message({
          type: 'info',
          message: '该组不能删除'
        })
      }
      this.$emit('del', this.tabList.filter(item => item.id === this.tabId)[0])
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.$emit('search', this.search)
    },
    /**
     * 点击添加按钮时触发
     */
    handleAdd() {
      this.$emit('add')
    },
    /**
     * 点击刷新按钮时触发
     */
    handleRefresh() {
      this.$emit('refresh')
    },
    /**
     * pageSize 改变时会触发
     * @param {size} size 为每页条数
     */
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    /**
     * pageSize 改变时会触发
     * @param {currentPage} currentPage 为当前页
     */
    handleCurrentChange(currentPage) {
      this.$emit('current-change', currentPage)
    }
  }
}
</script>

<style lang="scss">
.layout-container {
  .el-tabs {
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__nav-wrap.is-scrollable {
      display: flex;
      align-items: center;
    }

    .el-tabs__item {
      border: 1px solid #dcdfe6;
      line-height: 1;
      height: auto;
      padding: 7px 15px !important;
      font-size: 12px;
      border-radius: 3px;
      margin-right: 10px;
      &.is-active {
        border-color: #409EFF;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .el-table--medium td, .el-table--medium th {
    padding: 5px 0;
  }
}
</style>

<style lang="scss" scoped>
.layout-container {
    height: 100%;
    padding: 15px 15px 0 15px;
    position: relative;
    h5 {
      margin: 0 0 15px 0;
    }
    header {
      .tabs-hd {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tab-left {
          max-width: 96%;
        }
        .tab-right {
          margin-bottom: 15px;
          padding-right: 10px;
        }
      }
      .action {
        margin-bottom: 15px;
        padding-right: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .search {
          flex: 1;
        }
        .el-button {
          margin-left: 10px;
        }
      }
    }
    .pagination-footer {
      height: 40px;
      width: 100%;
      padding-right: 1em;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
