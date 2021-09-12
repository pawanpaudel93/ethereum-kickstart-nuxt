<template>
  <v-container>
    <h3>Create a Campaign</h3>
    <v-form @submit.prevent="onSubmit" ref="form">
      <v-text-field
        v-model="minimumContribution"
        :rules="[rules.required]"
        suffix="wei"
        label="Minimum Contribution"
        type="number"
        required
      ></v-text-field>
      <v-alert dense outlined type="error" v-if="errorMessage !== ''">
        {{ errorMessage }}
      </v-alert>
      <v-btn type="submit" color="primary" class="mr-4" :loading="isLoading">
        Create
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import factory from '@/ethereum/factory'
import web3 from '@/ethereum/web3'
export default {
  data() {
    return {
      isLoading: false,
      minimumContribution: '',
      errorMessage: '',
      rules: {
        required: (value) =>
          value !== '' || 'Minimum Contribution Required !!!',
      },
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      this.isLoading = true
      this.errorMessage = ''
      const accounts = await web3.eth.getAccounts()
      try {
        await factory.methods.createCampaign(this.minimumContribution).send({
          from: accounts[0],
        })
        this.$router.push('/')
      } catch (err) {
        this.errorMessage = err.message
      }
      this.isLoading = false
    },
  },
}
</script>
