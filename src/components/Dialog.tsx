import React, { useState, forwardRef, Ref, useImperativeHandle } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import DialogRef from './types/DialogRef';

const CustomDialog = forwardRef(function CustomDialog(
  props: {
    title: string;
    desc: string;
    onClose: (accept: boolean) => void;
    children?: React.ReactNode;
  },
  ref: Ref<DialogRef>
) {
  const [isOpen, setIsOpen] = useState(false);
  useImperativeHandle(ref, () => ({ openDialog }));

  const openDialog = () => setIsOpen(true);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black bg-opacity-30 fixed inset-0' />
        <Dialog.Content
          style={{ zIndex: 10000 }}
          className='bg-white bg-opacity-100 rounded-md shadow-md p-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md'
        >
          <Dialog.Title className='font-bold text-lg'>{props.title}</Dialog.Title>
          <Dialog.Description className='mb-4'>{props.desc}</Dialog.Description>
          <fieldset className='flex gap-5 items-center'>{props.children}</fieldset>
          <div className='flex mt-4 justify-evenly'>
            <Dialog.Close asChild>
              <button
                className='bg-red-400 text-red-800 font-bold rounded-md px-3 py-2'
                onClick={() => props.onClose(false)}
              >
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className='bg-green-400 text-green-800 font-bold rounded-md px-3 py-2'
                onClick={() => props.onClose(true)}
              >
                Accept
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className='absolute top-3 right-3'
              aria-label='Close'
              onClick={() => props.onClose(false)}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export default CustomDialog;
