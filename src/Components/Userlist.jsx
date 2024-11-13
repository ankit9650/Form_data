import React from 'react';
import { useGetUsersQuery} from '../Features/Cart/api/apiSlice';


function Userlist() {
    const { data: users, error, isLoading } = useGetUsersQuery();
    // const [addUsers] = useAddUsersMutation();
    // const [udpateUsers] = useUpdateUsersMutation();    
    
    if (isLoading) return <div className="text-center text-xl text-gray-500">Loading...</div>;
    if (error) return <div className='text-center text-xl text-red-500 font-bold'>{error.message}</div>
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-5">
            <h2 className="text-3xl font-extrabold font-Poppins text-center text-gray-800 mb-6 ">User List</h2>
            {/* <button type="button" className='border py-2 px-2 mb-2 rounded-lg' onClick={handleAdduser}>Add User</button> */}
            <ul className="space-y-4">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                                {/* User Info */}
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-700"><strong>Email:</strong> {user.email}</p>
                                    <p className="font-medium text-gray-700"><strong>Username:</strong> {user.username}</p>
                                    <p className="font-medium text-gray-700"><strong>Phone:</strong> {user.phone}</p>
                                </div>
                                <img
                                    src={`http://localhost:5000${user.Avatar}`}
                                    alt="User Avatar"
                                    className="w-24 h-24 rounded-full mb-4"
                                />
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No users found.</p>
                )}
            </ul>   
        </div>
    );
}

export default Userlist;
