import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const toggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button shape="circle" onClick={toggle}>
      {resolvedTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
    </Button>
  );
}