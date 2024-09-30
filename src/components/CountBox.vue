<template>
  <div class="CountBox">
    <button @click="handleSub" class="minus">-</button>
    <input type="text" @change="handleChange" :value="value" class="inp">
    <button @click="handleAdd" class="add ">+</button>
  </div>
</template>

<script>

export default {
  props: {
    value: Number
  },
  methods: {
    handleSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleChange (e) {
      const num = +e.target.value
      if (isNaN(num) || num <= 0 || num % 1 !== 0) {
        e.target.value = this.value
      } else {
        this.$emit('input', num)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.CountBox {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    outline: none;
    border: none;
    text-align: center;
     background-color: #efefef;
  }
}
</style>
