<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    // 获取icon
    this.$store.dispatch('getIcon')

    // 获取所有标签
    this.$store.dispatch('getTagsAll')

    // 获取所有分类
    this.$store.dispatch('getCategoryAll')
  }
}
</script>
