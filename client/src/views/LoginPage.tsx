import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationState } from '../config/state';
import MainButton from '../components/MainButton';
import { Label, ViewContainer, Input, Form } from '../assets/styles/styles';
import { userLogin } from '../config/services';

const STATUS = {
  idle: 'Esperando al usuario',
  loading: 'Enviando datos',
  success: 'Ingreso exitoso',
  error: 'Error al ingresar',
};

export const Login: React.FC = () => {
  const [state, setState] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(STATUS.idle);
  const { setUser } = useApplicationState();
  const navigateTo = useNavigate();

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function onFormSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = state;
    if (!email || !password) return;
    try {
      setStatus(STATUS.loading);
      const response = await userLogin(state);
      setUser(response.userInfo);
      navigateTo('/main-screen', { replace: true });
    } catch (error: unknown) {
      setStatus(STATUS.error);
      console.error(error);
    }
  }

  const inputSize = 1.8;

  return (
    <ViewContainer gap='10px' >
      {
        status === STATUS.idle && <>
          <Label size='1.4' textalign='center'>Ingresa con tu nombre y correo electrónico</Label>

          <Form onSubmit={onFormSubmit}>
            <Label size='.8'>Email</Label>
            <Input size={inputSize}
              type="email" id="email" placeholder="Correo electrónico..."
              value={state.email} onChange={onInputChange} />
            <Label size='.8'>Contraseña</Label>
            <Input size={inputSize}
              type="password" id="password" placeholder="Contraseña..."
              value={state.password} onChange={onInputChange} />
            <MainButton type="submit" >Ingresar</MainButton>
          </Form>
          <MainButton onClick={() => navigateTo('/registro')}>No tengo cuenta, quiero registrarme...</MainButton>
        </>
      }
      {
        status === STATUS.loading && <>
          <Label style={{ textAlign: 'center' }}>Enviando datos... un momento por favor.</Label>
        </>
      }
      {
        status === STATUS.error && <>
          <Label>¡Hubo un error al ingresar!</Label>
          <MainButton onClick={() => setStatus(STATUS.idle)}>Volver a intentar</MainButton>
          <MainButton onClick={() => navigateTo('/registro')}>No tengo cuenta, quiero registrarme...</MainButton>
        </>
      }
    </ViewContainer>
  );
};