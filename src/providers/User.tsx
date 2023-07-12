import {
  createSignal,
  createContext,
  useContext,
  createResource,
  createEffect,
  JSXElement,
  Setter,
  Resource
} from 'solid-js';
import { useNavigate } from '@solidjs/router';

const UserContext = createContext<
  [
    Resource<{ id: number; userName: string }>,
    {
      setUserId: Setter<string>;
      mutate: Setter<{ id: number; userName: string }>;
      refetch: (
        info?: Promise<{ id: number; userName: string }> | undefined
      ) => unknown;
    }
  ]
>();

const fetchUser = async (userId?: number) => {
  return await new Promise<{ id: number; userName: string }>(
    (resolve, reject) => {
      setTimeout(() => {
        console.log(userId, 'useId');
        if (userId == null) {
          reject(new Error('no sign in'));
        }
        resolve({ id: 1, userName: 'Jack' });
      }, 1000);
    }
  );
};

export function UserProvider(props: { userId?: number; children: JSXElement }) {
  const navigate = useNavigate();
  const localUserId = localStorage.getItem('userId');
  const [userId, setUserId] = createSignal(
    localUserId ? parseInt(localUserId) : 5
  );
  const [user, { mutate, refetch }] = createResource(userId, fetchUser);

  createEffect(() => {
    if (user.error) {
      navigate('./login', { replace: true });
    }
  });

  createEffect(() => {
    if (props.userId) {
      setUserId(props.userId);
    }
  });

  return (
    <UserContext.Provider
      value={[
        user,
        {
          setUserId,
          mutate,
          refetch
        }
      ]}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context) {
    return context;
  }
  throw new Error('use useUser inside UserProvider');
}
