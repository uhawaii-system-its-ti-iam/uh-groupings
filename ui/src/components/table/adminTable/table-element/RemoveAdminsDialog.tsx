import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
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
                  <DialogTitle>Remove Member</DialogTitle>
                  <DialogDescription>
                      You are about to remove the following member from the admins list.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="font-bold text-xs text-left">
                          NAME:
                      </Label>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="font-bold text-xs text-left">
                          UH USERNAME:
                      </Label>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="font-bold text-xs text-left">
                          UH USER ID:
                      </Label>
                  </div>
              </div>
              <DialogFooter>
                  <Button type="submit">Yes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
};

export default RemoveAdminsDialog;
