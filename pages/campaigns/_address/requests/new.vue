<template>
  <v-container fluid>
    <div class="mb-5">
      <v-btn
        :to="'/campaigns/' + $route.params.address + '/requests'"
        color="primary"
        text
        >Back</v-btn
      >
    </div>
    <h3>Create a request</h3>
    <v-form @submit.prevent="onSubmit" ref="form">
      <v-text-field
        v-model="request.description"
        :rules="rules.required"
        label="Description"
        type="text"
      ></v-text-field>
      <v-text-field
        v-model="request.value"
        :rules="rules.required"
        suffix="ether"
        label="Value in Ether"
        type="number"
      ></v-text-field>
      <v-text-field
        v-model="request.recipient"
        :rules="rules.required"
        label="Recipient"
        type="text"
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
import web3 from '@/ethereum/web3'
import Campaign from '@/ethereum/campaign'
export default {
  data() {
    return {
      request: { value: '', description: '', recipient: '' },
      errorMessage: '',
      isLoading: false,
      rules: {
        required: [(value) => !!value || 'Required.'],
      },
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      this.isLoading = true
      const campaign = Campaign(this.$route.params.address)
      try {
        const accounts = await web3.eth.getAccounts()
        await campaign.methods
          .createRequest(
            this.request.description,
            web3.utils.toWei(this.request.value, 'ether'),
            this.request.recipient
          )
          .send({ from: accounts[0] })
        this.$router.push(`/campaigns/${this.$route.params.address}/requests`)
      } catch (error) {
        this.errorMessage = error.message
      }
      this.isLoading = false
    },
  },
}
</script>