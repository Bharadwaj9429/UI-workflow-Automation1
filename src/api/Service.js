import httpService from '@/core/http.service';

const ENTITY_BASE_PATH = 'tickets'; // Based on entityName 'ticket'

// Mock data store for demonstration
let mockTickets = [
  {
    id: '1001',
    subject: 'Cannot log in to application',
    description: 'Users are reporting issues logging into the application. This seems to be widespread.',
    priority: 'Urgent',
    status: 'Open',
    assignedTo: 'John Doe',
    estimateHours: 8,
    attachments: [],
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T10:00:00Z',
    comments: [
      { id: 1, author: 'System', content: 'Ticket created.', datetime: '2023-10-26T10:00:00Z' },
      { id: 2, author: 'John Doe', content: 'Investigating network issues.', datetime: '2023-10-26T11:30:00Z' }
    ]
  },
  {
    id: '1002',
    subject: 'Feature request: Dark Mode',
    description: 'Requesting the addition of a dark mode theme for the application UI.',
    priority: 'Low',
    status: 'In Progress',
    assignedTo: 'Jane Smith',
    estimateHours: 20,
    attachments: ['design_mockup.png'],
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
    comments: [
      { id: 1, author: 'System', content: 'Ticket created.', datetime: '2023-10-25T14:00:00Z' },
      { id: 2, author: 'Jane Smith', content: 'Assessing feasibility.', datetime: '2023-10-25T16:00:00Z' }
    ]
  }
];
let nextId = 1003;

export const ticketService = {
  async createTicket(ticketData) {
    const newTicket = {
      id: String(nextId++),
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    mockTickets.push(newTicket);
    return new Promise(resolve => setTimeout(() => resolve({ data: newTicket }), 500));
    // try {
    //   const response = await httpService.post(ENTITY_BASE_PATH, ticketData);
    //   return response.data;
    // } catch (error) {
    //   console.error('Error creating ticket:', error);
    //   throw error;
    // }
  },

  async getTickets() {
    return new Promise(resolve => setTimeout(() => resolve(mockTickets), 500));
    // try {
    //   const response = await httpService.get(ENTITY_BASE_PATH);
    //   return response.data;
    // } catch (error) {
    //   console.error('Error fetching tickets:', error);
    //   throw error;
    // }
  },

  async getTicketById(id) {
    const ticket = mockTickets.find(t => t.id === id);
    return new Promise((resolve, reject) => setTimeout(() => {
      if (ticket) resolve(ticket);
      else reject({ message: 'Ticket not found' });
    }, 500));
    // try {
    //   const response = await httpService.get(`${ENTITY_BASE_PATH}/${id}`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching ticket with ID ${id}:`, error);
    //   throw error;
    // }
  },

  async updateTicket(id, ticketData) {
    const index = mockTickets.findIndex(t => t.id === id);
    if (index > -1) {
      mockTickets[index] = { ...mockTickets[index], ...ticketData, updatedAt: new Date().toISOString() };
      return new Promise(resolve => setTimeout(() => resolve({ data: mockTickets[index] }), 500));
    }
    return new Promise((resolve, reject) => setTimeout(() => reject({ message: 'Ticket not found' }), 500));
    // try {
    //   const response = await httpService.put(`${ENTITY_BASE_PATH}/${id}`, ticketData);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error updating ticket with ID ${id}:`, error);
    //   throw error;
    // }
  },

  async deleteTicket(id) {
    const initialLength = mockTickets.length;
    mockTickets = mockTickets.filter(t => t.id !== id);
    return new Promise((resolve, reject) => setTimeout(() => {
      if (mockTickets.length < initialLength) resolve({ success: true });
      else reject({ message: 'Ticket not found' });
    }, 500));
    // try {
    //   const response = await httpService.delete(`${ENTITY_BASE_PATH}/${id}`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error deleting ticket with ID ${id}:`, error);
    //   throw error;
    // }
  },

  async addCommentToTicket(ticketId, commentData) {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      if (!ticket.comments) ticket.comments = [];
      const newComment = { id: ticket.comments.length + 1, ...commentData, datetime: new Date().toISOString() };
      ticket.comments.push(newComment);
      ticket.updatedAt = new Date().toISOString();
      return new Promise(resolve => setTimeout(() => resolve({ data: newComment }), 500));
    }
    return new Promise((resolve, reject) => setTimeout(() => reject({ message: 'Ticket not found' }), 500));
    // try {
    //   const response = await httpService.post(`${ENTITY_BASE_PATH}/${ticketId}/comments`, commentData);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error adding comment to ticket ID ${ticketId}:`, error);
    //   throw error;
    // }
  }
};