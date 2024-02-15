export const handleDeleteTask = async (taskId, navigate) => {

    // ... (the implementation of handleDeleteTask)
    const userConfirmed = window.confirm("Are you sure you want to delete this task?");

    // If the user clicked "Cancel," do nothing
    if (!userConfirmed) {
        return;
    }

    try {
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNiNTU5MGQwNzQ3MzgzZTZmOTcxNzYiLCJpYXQiOjE3MDc4MjUzNTd9.V5Ld-_cBX6iU3RdXoPxdfwjnEHyExyAuIhpruWd_2Yw';
        const response = await fetch(`http://127.0.0.1:8000/tasks/deletetask/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }

        // Redirect to the homepage after successful deletion
        navigate('/mytask');
    } catch (error) {
        console.log('Error Deleting task:', error);
    }
};