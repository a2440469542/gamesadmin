<template>
  <el-select
    v-model="selectValue"
    class="channel-select"
    popper-class="channel-popper-class"
    placeholder="请选择"
    filterable
    
    :popper-append-to-body="false"
    @change="handleChannelFilter"
    @visible-change="visibleChange"
  >
    <el-option v-for="item in options" :key="item.cid" :label="item.title" :value="item.cid" />
    <el-option ref="el1" class="el-select-loading" value>
      <template v-if="hasMore">
        <el-icon class="el-icon-loading">
          <Loading />
        </el-icon>
        <span class="el-select-loading__tips">{{ loadingText || "正在加载" }}</span>
      </template>
      <template v-else>
        <div class="no-more">{{ noMoreText || "没有更多了~" }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script>
import { getChannelSelectionList } from "@/api/table";

export default {
  props: {
    value: {
      default: ""
    },
    from: ""
  },
  data() {
    return {
      selectValue: null,
      options: [],
      loading: false,
      requestId: 0,
      // 加载中的提示文案
      loadingText: "加载中",
      // 是否有更多数据可加载
      hasMore: true,
      // 没有更多数据的提示文案
      noMoreText: "没有更多了~",
      observer: null,
      pageData: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      },
      searchCondition: {
        page: 1,
        limit: 20,
        name: ""
      }
    };
  },
  methods: {
    loadOptions(query) {
      // return;
      this.loading = true;
      this.hasMore = true;
      this.searchCondition.name = query;
      this.searchCondition.page = 1;
      this.options = []
      this.pageData = {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1
      };
      // if(!this.options.length){
        this.getChannels(true)

      // }else{

      // }
    },
    visibleChange(b) {
      // if (b) {
      //   this.loadOptions("");
      // }
    },
    handleScroll(event) {
      const target = event.target;
      if (
        target.scrollHeight - target.scrollTop <= target.clientHeight &&
        this.options.length < this.pageData.total
      ) {
        if (this.loading) return;
        this.pageData.current_page += 1;
        this.getChannels();
      }
    },
    handleChannelFilter(value) {
      this.searchCondition.name = "";
      this.searchCondition.page = 1;
      this.pageData = {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
      };
      this.$emit("input", value);
      this.$emit("change", value);
    },
    getChannels(reset = false, cb = null) {
      this.loading = true;
      this.requestId++;
      getChannelSelectionList(this.searchCondition, this.requestId).then(
        response => {
          if (response.code === 0 && this.requestId === response.requestId) {
            if (reset) {
              if (response.data.last_page > response.data.current_page ) {
                this.loading = true;
                this.hasMore = true;
                this.searchCondition.page++;
                this.getChannels(true);
              } else {
                this.loading = false;
                this.hasMore = false;
              }
              let option_list = response.data.data;

              if (this.options.length) {
                this.options = [...this.options, ...response.data.data];
              } else {
                // 提现记录 需要增加全部
                if (this.from == "withdrawLog") {
                  let obj = {
                    cid: 0,
                    title: "全部渠道"
                  };
                  option_list.unshift(obj);
                }
                this.options = option_list;
              }
            } else {
              let opyions_data = [];
              response.data.data.forEach(r => {
                if (this.options.findIndex(d => d.cid === r.cid) < 0) {
                  opyions_data.push(r);
                }
              });

              // 提现记录 需要增加全部
              if (this.from == "withdrawLog") {
                let obj = {
                  cid: 0,
                  title: "全部渠道"
                };
                opyions_data.unshift(obj);
              }

              this.options = opyions_data;
            }

            this.pageData = response.data;
            this.hasMore = this.options.length < this.pageData.total;
            cb && cb();
          }

          this.loading = false;
        }
      );
    }
  },
  mounted() {
    this.getChannels(true, () => {
      if (this.options[0]) {
        this.selectValue = this.options[0] && this.options[0].cid;
      }
      this.$emit("input", this.selectValue);
      this.$emit("change", this.selectValue);
      if (!this.$refs.el1) {
        return;
      }

      this.observer = new IntersectionObserver(entries => {
        // console.error(entries)
        if (entries[0].isIntersecting && this.hasMore) {
          // 当更多的内容需要被加载时，调用加载数据的方法
          if (this.loading) return;
          this.searchCondition.page = this.pageData.current_page + 1;
          this.getChannels(true);
        }
      });

      this.observer.observe(this.$refs.el1.$el);
    });
  }
};
</script>

<style lang="css">
/*.channel-select {*/
/*  width: 220px;*/
/*}*/

/*.channel-select .channel-popper-class {*/
/*  height: 80px!important;*/
/*}*/

/*.channel-select .channel-popper-class .el-scrollbar {*/
/*  height: 80px!important;*/
/*}*/
</style>

<style lang="scss" scoped>
.el-select-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: initial;
  pointer-events: none;
  color: var(--el-color-info);
  font-size: 12px;
  .no-more {
    color: #97a8be;
    font-size: 12px;
  }

  &__icon {
    font-size: 16px;
    animation: rotate 1.5s linear infinite;
  }

  &__tips {
    margin-left: 6px;
    color: #97a8be;
    font-size: 12px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
