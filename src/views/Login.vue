<!--
  * @Description: 登录页面
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\Login.vue
-->
<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">信安社区平台</div>
      <el-form
        :model="form"
        :rules="formRules"
        ref="formRef"
        class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <el-icon><Avatar /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="form.password"
            @keyup.enter="submitForm()"
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { login } from '@/api/user.js';
// import jwtDecode from "jwt-decode";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const form = reactive({
      username: '',
      password: '',
    });
    const formRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };
    const formRef = ref(null);
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (!valid) return;
        login(form).then((data) => {
          store.commit('user/SET_TOKEN', data.token);
          // sessionStorage.setItem('token', data.token)
          // let decoded = jwtDecode(data.token)
          // console.log(decoded)
          // sessionStorage.setItem("nickname", decoded.nickname || '')
          // sessionStorage.setItem("username", decoded.username || '')
          router.push('/dashboard');
        });
      });
    };
    return {
      form,
      formRules,
      formRef,
      submitForm,
    };
  },
};
</script>
<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
