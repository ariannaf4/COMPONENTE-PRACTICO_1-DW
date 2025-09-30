<template>
  <div class="form-container">
    <h2>{{ isEditing ? 'Editar Usuario' : 'Formulario de Usuario' }}</h2>
    <div v-if="message" class="message">{{ message }}</div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>DNI:</label>
        <input type="text" v-model="formData.dni" maxlength="10" placeholder="CI. Máximo 10 dígitos" @input="validateDNI" required />
      </div>
      
      <div class="form-group">
        <label>Nombres:</label>
        <input type="text" v-model="formData.nombres" placeholder="Nombres completos" required />
      </div>
      
      <div class="form-group">
        <label>Apellidos:</label>
        <input type="text" v-model="formData.apellidos" placeholder="Apellidos completos" required />
      </div>
      
      <div class="form-group">
        <label>Fecha de Nacimiento:</label>
        <input type="date" v-model="formData.fechaNacimiento" required />
      </div>
      
      <div class="form-group">
        <label>Género:</label>
        <div class="radio-group">
          <label><input type="radio" v-model="formData.genero" value="masculino" required /> Masculino</label>
          <label><input type="radio" v-model="formData.genero" value="femenino" required /> Femenino</label>
          <label><input type="radio" v-model="formData.genero" value="otro" required /> Otro</label>
        </div>
      </div>
      
      <div class="form-group">
        <label>Ciudad:</label>
        <select v-model="formData.ciudad" required>
          <option value="">Seleccionar ciudad</option>
          <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
        </select>
      </div>
      
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Guardar Usuario') }}
      </button>
      <button v-if="isEditing" type="button" @click="$emit('cancel')" class="cancel-btn">Cancelar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: { editUser: { type: Object, default: null } },
  emits: ['cancel', 'success'],
  data() {
    return {
      formData: { dni: '', nombres: '', apellidos: '', fechaNacimiento: '', genero: '', ciudad: '' },
      message: '',
      isSubmitting: false,
      ciudades: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Huancayo', 'Tacna', 'Milagro', 'Guayaquil']
    }
  },
  computed: {
    isEditing() { return !!this.editUser }
  },
  watch: {
    editUser: {
      handler(newUser) {
        if (newUser) {
          this.formData = { ...newUser }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    validateDNI() {
      this.formData.dni = this.formData.dni.replace(/\D/g, '').slice(0, 10)
    },
    resetForm() {
      this.formData = { dni: '', nombres: '', apellidos: '', fechaNacimiento: '', genero: '', ciudad: '' }
      // No limpiar el mensaje inmediatamente, dejarlo que se vea
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      try {
        const url = this.isEditing ? `http://localhost:3000/api/usuarios/${this.editUser.id}` : 'http://localhost:3000/api/usuarios'
        const response = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        })
        if (response.ok) {
          this.message = this.isEditing ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente'
          
          // Limpiar formulario inmediatamente si no está editando
          if (!this.isEditing) this.resetForm()
          
          // Notificar éxito al padre
          this.$emit('success')
          
          // Limpiar mensaje después de 3 segundos
          setTimeout(() => {
            this.message = ''
          }, 3000)
        } else {
          const error = await response.json()
          this.message = error.error || 'Error al procesar usuario'
        }
      } catch (error) {
        this.message = 'Error de conexión'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>