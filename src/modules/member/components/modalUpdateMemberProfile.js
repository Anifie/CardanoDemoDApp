'use client';
import React, { useState } from 'react';
//import { memberProfilePut } from '../../../common/api/membership'
import { useMembership } from '../../../common/service/useMembership'
import { useForm } from 'react-hook-form';

const UpdateMemberProfileModal = ({ show, closeModal }) => {

  const { updateMemberProfile } = useMembership();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const submitHandler = async(data) => {
    
    let updateResult = await updateMemberProfile({displayName: data.nickname});
    console.log("updateResult", updateResult);

    reset();  // Reset form fields after submission
    closeModal(); // Close the modal
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-black">Update Profile</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-4">
            <label htmlFor="nickname" className="block font-medium text-gray-700 mb-2">
              New Nickname
            </label>
            <input
              id="nickname"
              type="text"
              {...register('nickname', {
                required: 'Nickname is required',
                minLength: { value: 3, message: 'Nickname must be at least 3 characters long' },
              })}
              className="input input-bordered w-full"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>
            )}
          </div>

          <div className="text-black">
            Update Avatar (todo)
            <br/>
            <br/>
          </div>

          <div className="flex justify-end space-x-2">
            {/* <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                reset(); // Reset form on cancel
                onClose();
              }}
            >
              Cancel
            </button> */}
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMemberProfileModal;