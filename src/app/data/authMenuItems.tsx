import useStorage from "../components/useStorage";

const useAuthMenuItems = () => {
  const { getItem } = useStorage();
  const username = getItem('username');

  const authMenuItems = [
    {
      title: 'Community',
      url: '/community',
    },
    {
      title: 'My Page',
      url: `/community/${username}`,
    },
  ];

  return authMenuItems;
};

export default useAuthMenuItems;
