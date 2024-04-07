"use client";

import { Button, ColorPicker, Input, Typography } from "antd";
import { User } from "../lib/db/user";
import { useMemo, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { updateUser } from "../actions/update-user";

const { Title } = Typography;

type UserSettingsProps = {
  user: User;
};

export function UserSettings({ user }: UserSettingsProps) {
  const [baseUser, setBaseUser] = useState(user);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newColour, setNewColour] = useState(user.colour);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const isSaveable = useMemo(() => {
    return (
      newDisplayName !== baseUser.displayName || newColour !== baseUser.colour
    );
  }, [newDisplayName, newColour, baseUser]);

  const updateUserWithOriginalData = updateUser.bind(null, baseUser);

  return (
    <div>
      <Title level={2} className="!text-2xl">
        User
      </Title>

      <form
        className="flex flex-col gap-4 items-start"
        action={async (formdata: FormData) => {
          console.log("Doing the actino");
          await updateUserWithOriginalData(formdata);
          setBaseUser((curr) => ({
            ...curr,
            displayName: newDisplayName,
            colour: newColour,
          }));
          setIsUpdatingUser(false);
        }}
        onSubmit={() => setIsUpdatingUser(true)}
      >
        <Input
          addonBefore="Display name"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          name="displayName"
        />

        <Input value={newColour} name="colour" className="!hidden" />

        <ColorPicker
          value={newColour}
          onChange={(e) => setNewColour(e.toHexString())}
        />

        <Button
          icon={<AiOutlineSave />}
          disabled={!isSaveable}
          loading={isUpdatingUser}
          type="primary"
          htmlType="submit"
          className="self-stretch !flex !items-center justify-center"
        >
          Save
        </Button>
      </form>
    </div>
  );
}
