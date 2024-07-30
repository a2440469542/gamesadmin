<template>
  <div class="login-out-container">
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <h3 class="title">Login Form</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Número de telefone"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="senha"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
        <el-button :loading="loading" type="success" style="margin-left:0px; width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">Register</el-button>
      </el-form>
    </div>
    <el-dialog :visible.sync="registerDialog" width="50%" :before-close="handleRegisterClose">
      <el-form
        ref="registerForm"
        :model="registeForm"
        label-position="left"
        :rules="registeRules"
      >
        <el-form-item label="Número de telefone" prop="username">
          <el-input v-model="registeForm.username" placeholder="Número de telefone"/>
        </el-form-item>
        <el-form-item label="senha" prop="password">
          <el-input type="password" show-password v-model="registeForm.password" placeholder="senha" maxlength="16" />
        </el-form-item>
        <el-form-item label="Confirme sua senha" prop="password2">
          <el-input type="password" show-password v-model="registeForm.password2" placeholder="Confirme sua senha" maxlength="16" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerDialog=false">Cancelar</el-button>
        <el-button type="primary" @click="registerSubmit">confirme</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { register } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Por favor insira o nome de usuário correto'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('A senha não pode ter menos de 6 dígitos'))
      } else {
        callback()
      }
    }
    const validateRegisterUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Por favor insira o nome de usuário correto'))
      } else {
        callback()
      }
    }
    const validateRegisterPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('A senha não pode ter menos de 6 dígitos'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      registeForm: {
        username: '',
        password: '',
        password2: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registeRules: {
        username: [{ required: true, trigger: 'blur', validator: validateRegisterUsername }],
        password: [{ required: true, trigger: 'blur', min: 6, max: 16, validator: validateRegisterPassword }],
        password2: [{ required: true, message: 'Por favor insira a senha', trigger: 'blur' },
          { min: 6, message: 'A senha não pode ter menos de 6 dígitos', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.registeForm.password) {
                callback(new Error('A senha digitada duas vezes é inconsistente'))
              } else {
                callback()
              }
            }
          }]
      },
      loading: false,
      registerDialog: false,
      passwordType: 'password',
      redirect: undefined,
      codeImg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.registerDialog = true
    },
    registerSubmit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register({
            mobile: this.registeForm.username,
            pwd: this.registeForm.password
          }).then((response) => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: 'cadastre-se com sucesso!'
              })
              this.loading = false
              this.registerDialog = false
              this.loginForm.username = this.registeForm.username
              this.loginForm.password = this.registeForm.password
            }
          })
        } else {
          console.log('registro de erro!')
          return false
        }
      })
    },
    handleRegisterClose() {
      this.registerDialog = false
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .set-code {
    display: flex;
    align-items: center;
    .code {
      width: 100px;
      height: 47px;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container .el-form-item {
  background: rgba(0, 0, 0, 0);
}

.login-out-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
}

.login-container {
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
