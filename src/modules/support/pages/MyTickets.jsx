import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button, Tag, message, Popconfirm } from 'antd';
import supportService from '@/api/Service'; // Using the unified service file

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tickets. Please try again.');
      message.error('Failed to fetch tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/support/tickets/${id}`);
  };

  const handleEdit = (id) => {
    // In a full application, this would navigate to a dedicated Edit Ticket form.
    // For this module, we'll navigate to the detail page for now, or you could imagine
    // it opens the CreateTicket form in edit mode (not fully implemented here).
    navigate(`/support/tickets/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await supportService.deleteTicket(id);
      message.success('Ticket deleted successfully!');
      fetchTickets(); // Re-fetch tickets after deletion
    } catch (err) {
      message.error('Failed to delete ticket.');
      console.error(err);
    }
  };

  const statusCell = (props) => {
    const status = props.dataItem.status;
    let color = 'geekblue';
    if (status === 'Open') color = 'blue';
    else if (status === 'In Progress') color = 'gold';
    else if (status === 'Resolved') color = 'green';
    else if (status === 'Closed') color = 'red';
    return (
      <td className="k-grid-content-sticky">
        <Tag color={color}>{status}</Tag>
      </td>
    );
  };

  const priorityCell = (props) => {
    const priority = props.dataItem.priority;
    let color = 'default';
    if (priority === 'Low') color = 'green';
    else if (priority === 'Medium') color = 'gold';
    else if (priority === 'High') color = 'red';
    return (
      <td className="k-grid-content-sticky">
        <Tag color={color}>{priority}</Tag>
      </td>
    );
  };

  const ActionsCell = (props) => (
    <td>
      <Button
        type="link"
        onClick={() => handleView(props.dataItem.id)}
        className="text-[#1890ff] hover:underline p-0 h-[40px]"
      >
        View
      </Button>
      <Button
        type="link"
        onClick={() => handleEdit(props.dataItem.id)}
        className="text-[#1890ff] hover:underline p-0 h-[40px]"
      >
        Edit
      </Button>
      <Popconfirm
        title="Are you sure to delete this ticket?"
        onConfirm={() => handleDelete(props.dataItem.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="link"
          danger
          className="p-0 h-[40px]"
        >
          Delete
        </Button>
      </Popconfirm>
    </td>
  );

  if (loading) return <div className="p-6 text-center">Loading tickets...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Tickets</h1>
        <Button
          type="primary"
          onClick={() => navigate('/support/tickets/create')}
          style={{ backgroundColor: '#1890ff', height: '40px' }}
        >
          Create New Ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No tickets found.</div>
      ) : (
        <Grid
          data={tickets}
          className="kendo-grid-container"
          scrollable="scrollable"
          reorderable={true}
          resizable={true}
        >
          <GridColumn field="id" title="ID" width="90px" />
          <GridColumn field="subject" title="Subject" width="250px" />
          <GridColumn field="priority" title="Priority" cell={priorityCell} width="120px" />
          <GridColumn field="status" title="Status" cell={statusCell} width="120px" />
          <GridColumn field="assignedTo" title="Assigned To" width="150px" />
          <GridColumn field="createdAt" title="Created At" width="180px" format="{0:yyyy-MM-dd HH:mm}" />
          <GridColumn title="Actions" cell={ActionsCell} width="180px" />
        </Grid>
      )}
    </div>
  );
};

export default MyTickets;