import React, { useState, useEffect } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as supportService from '@/api/supportService'; // Corrected import

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await supportService.getTickets();
        setTickets(data);
      } catch (err) {
        setError(err);
        message.error('Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        setLoading(true);
        await supportService.deleteTicket(id);
        message.success('Ticket deleted successfully.');
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } catch (err) {
        message.error('Failed to delete ticket.');
      } finally {
        setLoading(false);
      }
    }
  };

  const statusCell = (props) => {
    const status = props.dataItem.status;
    let color = 'blue';
    if (status === 'Closed') color = 'green';
    else if (status === 'In Progress') color = 'gold';
    return (
      <td>
        <Tag color={color}>{status}</Tag>
      </td>
    );
  };

  const priorityCell = (props) => {
    const priority = props.dataItem.priority;
    let color = 'geekblue';
    if (priority === 'Urgent') color = 'red';
    else if (priority === 'High') color = 'orange';
    return (
      <td>
        <Tag color={color}>{priority}</Tag>
      </td>
    );
  };

  const actionCell = (props) => {
    const id = props.dataItem.id;
    return (
      <td>
        <Button type="link" onClick={() => navigate(`/support/tickets/${id}`)}>View</Button>
        <Button type="link" onClick={() => navigate(`/support/tickets/${id}/edit`)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(id)}>Delete</Button>
      </td>
    );
  };

  if (loading) return <div className="p-4">Loading tickets...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ticket List</h1>
        <Button type="primary" className="bg-blue-600 h-10" onClick={() => navigate('/support/tickets/create')}>Create Ticket</Button>
      </div>
      <Grid data={tickets} style={{ height: '500px' }}>
        <GridColumn field="id" title="ID" width="70px" />
        <GridColumn field="subject" title="Subject" />
        <GridColumn field="status" title="Status" cell={statusCell} />
        <GridColumn field="priority" title="Priority" cell={priorityCell} />
        <GridColumn field="assigneeId" title="Assignee" />
        <GridColumn title="Actions" cell={actionCell} width="200px" />
      </Grid>
    </div>
  );
};

export default TicketList;