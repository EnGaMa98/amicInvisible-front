import { api } from '../api';

const ParticipantsService = {
  list: (groupId, params = {}) => {
    return api.get(`/groups/${groupId}/participants`, params);
  },

  save: (groupId, participantId, data) => {
    if (participantId) {
      return api.put(`/groups/${groupId}/participants/${participantId}`, data);
    }
    return api.post(`/groups/${groupId}/participants`, data);
  },

  remove: (groupId, participantId) => {
    return api.del(`/groups/${groupId}/participants/${participantId}`);
  },
};

export default ParticipantsService;
