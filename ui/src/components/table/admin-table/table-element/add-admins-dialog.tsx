import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { MemberResult } from '@/lib/types';
import { addAdmin } from '@/lib/actions';

interface InputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const AddAdminsDialog = ({input, setInput} : InputProps, {uid, name, uhUuid} : MemberResult) => {

  return (
      <div className="inline-flex" role="group">
          <Input
              className="rounded-r-none"
              placeholder={'UH Username or UH #'}
              value={input || ''}

              onChange={e => setInput(e.target.value)}
          />
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button
                      className="rounded-l-none"
                  >
                      Add
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px]">
                  <AlertDialogHeader>
                      <AlertDialogTitle className="text-[1.4rem] text-text-color">Add Member</AlertDialogTitle>
                      <AlertDialogDescription>
                          You are about to add the following member to the admins list.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid grid-cols-2">
                      <div className="grid">
                          <div className="grid grid-cols-3 items-center py-1 px-4">
                              <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                  NAME:
                              </Label>
                          </div>
                          <div className="grid grid-cols-3 items-center py-1 px-4">
                              <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                  UH USERNAME:
                              </Label>
                          </div>
                          <div className="grid grid-cols-3 items-center py-1 px-4">
                              <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                  UH USER ID:
                              </Label>
                          </div>
                      </div>

                      {/*second column*/}

                      <div className="grid">
                          <div className="grid grid-cols-3 items-center">
                              <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                  {name}
                              </Label>
                          </div>
                          <div className="grid grid-cols-4 items-center">
                              <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                  {uid}
                              </Label>
                          </div>
                          <div className="grid grid-cols-4 items-center">
                              <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                  {uhUuid}
                              </Label>
                          </div>
                      </div>
                  </div>
                  <AlertDialogDescription>
                      Are you sure you want to add <span className="font-bold text-text-color">{name}</span> to the admins list?
                  </AlertDialogDescription>
                  <div className="px-3">
                      <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                          <AlertDescription>
                              Membership changes made
                              may not take effect immediately.
                              Usually, 3-5 minutes should be
                              anticipated. In extreme cases changes
                              may take several hours to be fully
                              processed, depending on the number
                              of members and the synchronization
                              destination.
                          </AlertDescription>
                      </Alert>
                  </div>
                  <AlertDialogFooter>
                      <Button onClick={() => addAdmin(uid)}>Yes</Button>
                      <AlertDialogCancel onClick={() => close()}>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
};

export default AddAdminsDialog;
