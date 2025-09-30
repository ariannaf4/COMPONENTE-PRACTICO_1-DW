<template>
  <div class="users-list">
    <h3>Usuarios Registrados ({{ users.length }})</h3>
    
    <div v-if="loading" class="loading">Cargando usuarios...</div>
    
    <div v-else-if="users.length === 0" class="no-users">
      <p>No hay usuarios registrados</p>
    </div>
    
    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-info">
          <strong>{{ user.nombres }} {{ user.apellidos }}</strong>
          <p>DNI: {{ user.dni }}</p>
          <p>Fecha: {{ formatDate(user.fecha_nacimiento) }}</p>
          <p>Género: {{ user.genero }}</p>
          <p>Ciudad: {{ user.ciudad }}</p>
        </div>
        <div class="user-actions">
          <button @click="$emit('edit', user)" class="edit-btn">
            Editar
          </button>
          <button @click="$emit('delete', user)" class="delete-btn">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    
    <button @click="loadUsers" class="refresh-btn">
      Actualizar Lista
    </button>
  </div>
</template>

<script>
export default {
  name: 'UsersList',
  emits: ['edit', 'delete'],
  props: {
    refreshTrigger: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      users: [],
      loading: true
    }
  },
  watch: {
    refreshTrigger() {
      this.loadUsers()
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true
        const response = await fetch('http://localhost:3000/api/usuarios')
        
        if (response.ok) {
          const data = await response.json()
          this.users = data || []
        } else {
          console.error('Error al cargar usuarios')
          this.users = []
        }
      } catch (error) {
        console.error('Error de conexión:', error)
        this.users = []
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-PE')
    }
  }
}
</script>