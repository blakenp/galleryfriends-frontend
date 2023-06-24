const username = sessionStorage.getItem('username')

export const AuthMenuItems = [
    {
        title: 'Community',
        url: '/community',
    },
    {
        title: 'My Page',
        url: `/community/${username}`,
    },
]
