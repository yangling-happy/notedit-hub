import { Button, Input, Modal, Space, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface ShareLinkModalProps {
  open: boolean;
  shareUrl: string;
  loading: boolean;
  title: string;
  tip: string;
  copyText: string;
  onCancel: () => void;
  onCopy: () => void;
}

export const ShareLinkModal = ({
  open,
  shareUrl,
  loading,
  title,
  tip,
  copyText,
  onCancel,
  onCopy,
}: ShareLinkModalProps) => {
  return (
    <Modal open={open} title={title} onCancel={onCancel} footer={null}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Typography.Text type="secondary">{tip}</Typography.Text>
        <Input value={shareUrl} readOnly disabled={loading} />
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={onCopy}
          disabled={!shareUrl}
          loading={loading}
          block
        >
          {copyText}
        </Button>
      </Space>
    </Modal>
  );
};
