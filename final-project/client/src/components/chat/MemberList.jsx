import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createData } from "../../services/Api";

const MemberList = () => {
  const [users, setUsers] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const getUserByDivision = async () => {
    try {
      const response = await createData("/user/division/get", {
        division_id: user.Employee.division_id,
      });
      setUsers(response);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserByDivision();
  }, []);

  const renderSkeleton = () => {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="hover:bg-gray-700 p-2 rounded cursor-pointer flex"
          >
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            <div className="ml-2 flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col space-y-2 hidden md:block">
      <h2 className="text-lg font-bold mb-4">Members</h2>
      <div className="flex flex-col space-y-1">
        {users === null ? (
          renderSkeleton()
        ) : users.length > 1 ? (
          users.map((user) => (
            <div
              className="hover:bg-gray-700 p-2 rounded cursor-pointer flex"
              key={user.id}
            >
              <div>
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${
                    user.Employee.profile_picture
                  }`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="ml-2">
                {`${user.Employee.first_name} ${user.Employee.last_name}`}
              </div>
            </div>
          ))
        ) : (
          <div>No members found.</div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
