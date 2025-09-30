<template>
  <div class="app">
    <h1>Sistema de Usuarios</h1>
    <div class="nav">
      <button @click="showForm" :class="{ active: currentView === 'form' }">
        {{ editUser ? 'Editar' : 'Nuevo Usuario' }}
      </button>
      <button @click="showList" :class="{ active: currentView === 'list' }">
        Ver Usuarios
      </button>
    </div>
    <Form v-if="currentView === 'form'" :editUser="editUser" @cancel="showList" @success="handleSuccess" />
    <UsersList v-else :refreshTrigger="refreshUsers" @edit="handleEdit" @delete="handleDelete" />
  </div>
</template>

<script>
import Form from './Form.vue'
import UsersList from './List.vue'

export default {
  name: 'App',
  components: { Form, UsersList },
  data() {
    return { currentView: 'form', editUser: null, refreshUsers: 0 }
  },
  methods: {
    showForm() { this.currentView = 'form'; this.editUser = null },
    showList() { this.currentView = 'list'; this.refreshUsers++ },
    handleEdit(user) {
      this.editUser = { ...user, fechaNacimiento: new Date(user.fecha_nacimiento).toISOString().split('T')[0] }
      this.currentView = 'form'
    },
    async handleDelete(user) {
      if (confirm(`¿Eliminar a ${user.nombres} ${user.apellidos}?`)) {
        try {
          const response = await fetch(`http://localhost:3000/api/usuarios/${user.id}`, { method: 'DELETE' })
          alert(response.ok ? 'Usuario eliminado' : 'Error al eliminar usuario')
          if (response.ok) this.refreshUsers++
        } catch (error) {
          alert('Error de conexión')
        }
      }
    },
    handleSuccess() { this.refreshUsers++ }
  }
}
</script>