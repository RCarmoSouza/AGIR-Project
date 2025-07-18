import api from './api';
import useAppStore from '../stores/appStore';

class PeopleService {
  async getPeople(params = {}) {
    try {
      useAppStore.getState().setLoading('people', true);
      const response = await api.get('/people', { params });
      
      if (response.data.success) {
        const people = response.data.data.people;
        useAppStore.getState().setPeople(people);
        return {
          people,
          pagination: response.data.data.pagination
        };
      } else {
        throw new Error(response.data.message || 'Erro ao buscar pessoas');
      }
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('people', false);
    }
  }

  async getPersonById(id) {
    try {
      const response = await api.get(`/people/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar pessoa');
      }
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error);
      throw error;
    }
  }

  async createPerson(personData) {
    try {
      const response = await api.post('/people', personData);
      
      if (response.data.success) {
        const newPerson = response.data.data;
        useAppStore.getState().addPerson(newPerson);
        return newPerson;
      } else {
        throw new Error(response.data.message || 'Erro ao criar pessoa');
      }
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      throw error;
    }
  }

  async updatePerson(id, updates) {
    try {
      const response = await api.put(`/people/${id}`, updates);
      
      if (response.data.success) {
        const updatedPerson = response.data.data;
        useAppStore.getState().updatePerson(id, updatedPerson);
        return updatedPerson;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar pessoa');
      }
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      throw error;
    }
  }

  async deletePerson(id) {
    try {
      const response = await api.delete(`/people/${id}`);
      
      if (response.data.success) {
        useAppStore.getState().removePerson(id);
        return true;
      } else {
        throw new Error(response.data.message || 'Erro ao deletar pessoa');
      }
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
      throw error;
    }
  }

  async getPeopleStats() {
    try {
      const response = await api.get('/people/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar estatísticas');
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de pessoas:', error);
      throw error;
    }
  }

  // Métodos auxiliares para formatação
  getFullName(person) {
    return `${person.firstName} ${person.lastName}`;
  }

  getInitials(person) {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  }

  formatPersonForDisplay(person) {
    return {
      ...person,
      fullName: this.getFullName(person),
      initials: this.getInitials(person),
      displayPosition: person.position || 'Sem cargo definido',
      displayDepartment: person.department || 'Sem departamento'
    };
  }
}

export default new PeopleService();

