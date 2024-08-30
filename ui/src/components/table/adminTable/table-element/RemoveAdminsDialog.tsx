import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

const RemoveAdminsDialog = () => {

  return (
      <Dialog>
          <DialogTrigger asChild>
              <Trash2Icon
                className="h-4 w-4 text-red-600"
              />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle className="text-[1.5rem] text-text-color">Remove Member</DialogTitle>
                  <hr/>
                  <DialogDescription>
                      You are about to remove the following member from the admins list.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2">
                  <div className="col-first grid py-4">
                      <div className="grid grid-cols-3 items-center ">
                          <Label htmlFor="name" className="font-bold text-xs text-left whitespace-nowrap">
                              NAME:
                          </Label>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                          <Label htmlFor="name" className="font-bold text-xs text-left whitespace-nowrap">
                              UH USERNAME:
                          </Label>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                          <Label htmlFor="name" className="font-bold text-xs text-left whitespace-nowrap">
                              UH USER ID:
                          </Label>
                      </div>
                  </div>

                  {/*second column*/}

                  <div className="col-first grid py-4">
                      <div className="grid grid-cols-3 items-center">
                          <Label htmlFor="name" className="text-xs text-left whitespace-nowrap">
                            NAME
                          </Label>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                          <Label htmlFor="name" className="text-xs text-left whitespace-nowrap">
                              UH USERNAME
                          </Label>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                          <Label htmlFor="name" className="text-xs text-left whitespace-nowrap">
                              UH USER ID
                          </Label>
                      </div>
                  </div>
              </div>
              <div>
                  <DialogDescription>
                      Are you sure you want to remove <span className="font-bold text-text-color">NAME</span> from the admins list?
                  </DialogDescription>
              </div>
              <Alert>
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
              <DialogFooter>
                  <Button>Yes</Button>
                  <Button variant="secondary">Cancel</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
};

export default RemoveAdminsDialog;
