<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
      </div>
      <div v-else key="expand" class="sidebar-logo-link" to="/">
          <el-select
            v-model="Channel.cid"
            placeholder="请选择"
            @change="handleChannelFilter"
          >
            <el-option
              v-for="item in options"
              :key="item.cid"
              :label="item.title"
              :value="item.cid"
            />
          </el-select>
      </div>
    </transition>
  </div>
</template>

<script>
import { getChannelList } from '@/api/table'
import user from '@/store/modules/user'

export default {
  name: 'SidebarLogo',
  components: { },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      Channel: {
        cid: ''
      },
      options: [
        {
          cid: '',
          title: '请选择'
        }
      ]
    }
  },
  created() {
    this.channelList()
  },
  methods: {
    channelList() {
      getChannelList().then((response) => {
        if (response.code === 0) {
          this.options = response.data
          // console.error('localStorage cid',localStorage.getItem('cid'))
          if (localStorage.getItem('cid')) {
            this.Channel.cid = Number(localStorage.getItem('cid'))
          }
          else {
            this.Channel.cid = this.options[0].cid
          }
          // this.Channel.cid = this.options[0].cid
          this.setCid()
        }
      })
    },
    handleChannelFilter(value) {
      this.Channel.cid = value
      this.setCid()
      this.$router.go(0)
    },
    setCid(){
      this.$store.commit('user/SET_CHANNEL', this.Channel.cid)
      localStorage.setItem('cid', this.Channel.cid)
      // console.log('cid', this.$store.state.user.cid)
      // console.log('log', localStorage.getItem('cid'))
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
