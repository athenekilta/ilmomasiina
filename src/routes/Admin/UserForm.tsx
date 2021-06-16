/** @jsx jsx */
import { Box, Button, Input } from '@theme-ui/components';
import { Spinner } from '@theme-ui/components';
import { useForm } from 'react-hook-form';
import { jsx } from 'theme-ui';

type FormData = {
  email: string;
};

type Props = {
  handleCreateUser: (email: string) => void;
  loading: boolean;
};

const UserForm = (props: Props) => {
  const { handleCreateUser, loading } = props;
  const {
    register, setValue, handleSubmit, errors,
  } = useForm<FormData>();

  const onSubmit = (data) => {
    handleCreateUser(data.email);
  };

  return (
    <Box
      sx={{
        maxWidth: 256,
      }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="email"
        type="email"
        placeholder="Sähköposti"
        ref={register({ required: true })}
      />
      <Button type="submit" variant="secondary">
        {loading ? <Spinner /> : 'Luo uusi käyttäjä'}
      </Button>
    </Box>
  );
};

export default UserForm;
