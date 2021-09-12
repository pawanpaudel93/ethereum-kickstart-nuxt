<template>
  <v-container>
    <v-form @submit.prevent="onSubmit" ref="form">
      <v-text-field
        v-model="value"
        :rules="rules.required"
        suffix="ether"
        label="Amount to Contribute"
        type="number"
      ></v-text-field>
      <v-alert dense outlined type="error" v-if="errorMessage !== ''">
        {{ errorMessage }}
      </v-alert>
      <v-btn type="submit" color="primary" class="mr-4" :loading="isLoading">
        Contribute
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import web3 from '@/ethereum/web3'
import Campaign from '@/ethereum/campaign'
export default {
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      value: '',
      errorMessage: '',
      rules: {
        required: [(value) => value !== '' || 'Contribution Required !!!'],
      },
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      this.isLoading = true
      this.errorMessage = ''
      const campaign = Campaign(this.address)
      try {
        const accounts = await web3.eth.getAccounts()
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(this.value, 'ether'),
        })
        this.$emit('contributed')
        this.$refs.form.reset()
      } catch (err) {
        this.errorMessage = err.message
      }
      this.isLoading = false
    },
  },
}
</script>
