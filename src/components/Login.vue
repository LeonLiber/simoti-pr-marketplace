<template>
  <el-row justify="center" align="middle" type="flex">
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-card class="box-card">

        <div slot="header">Login</div>

        <el-alert v-if="error" title="Login error" class="validation-alert" type="error" :description="error.response.data.error" show-icon></el-alert>

        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="Email">
            <el-input placeholder="Your email address" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="Password">
            <el-input placeholder="Your password" v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">Login</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import auth from '../services/auth';

export default {
  name: 'bias',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: '',
    };
  },
  methods: {
    login() {
      auth.login(this, this.form, '/');
    },
  },
};
</script>

<style scoped>
  .box-card {
    margin: 10px;
  }
  .validation-alert {
    margin-bottom: 15px;
  }
</style>
