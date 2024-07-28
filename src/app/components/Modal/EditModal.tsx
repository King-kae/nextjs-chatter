// EditModal.tsx
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../hook/useToast';
import useCurrentUser from '../../hook/useCurrentUser';
import useUsers from '../../hook/useUsers';
import { useEditModal } from '@/app/hook/useModal';
import Modal from '../Modal';
import Input from '../Input';
import ImageUpload from '../ImageInput/ImageUpload';

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchUser } = useUsers(currentUser?.id);
  const toast = useToast();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [work, setWork] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setBio(currentUser.bio || '');
      setWork(currentUser.work || '');
      setSkills(currentUser.skills || '');
      setLocation(currentUser.location || '');
    }
  }, [currentUser]);

  const editModal = useEditModal();

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.patch('/api/user', {
        username,
        bio,
        work,
        skills,
        profileImage,
        coverImage,
        location,
      });
      mutateFetchUser();
      editModal.onClose();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [username, bio, work, skills, profileImage, coverImage, location, mutateFetchUser, editModal, toast]);

  const bodyContent = (
    <div className='flex flex-col space-y-4'>
      <ImageUpload
        label='Cover image'
        disabled={isLoading}
        onChange={(base64) => setCoverImage(base64 as unknown as File)}
        value={coverImage}
      />
      <ImageUpload
        label='Profile image'
        disabled={isLoading}
        onChange={(base64) => setProfileImage(base64 as unknown as File)}
        value={profileImage}
        variants='profile'
      />
      <Input
        disabled={isLoading}
        label='Name'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variants='signIn'
      />
      <Input
        disabled={isLoading}
        label='Bio'
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <Input
        disabled={isLoading}
        label='Location'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title='Edit your profile'
      actionLabel='Save'
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
