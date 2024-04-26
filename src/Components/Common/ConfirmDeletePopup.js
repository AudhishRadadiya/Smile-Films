import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { memo } from 'react';

const ConfirmDeletePopup = memo(
  ({ deletePopup, setDeletePopup, handleDelete }) => {
    return (
      <>
        <Dialog
          header="Delete Confirmation"
          visible={deletePopup}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setDeletePopup(false)}
        >
          <div className="delete_wrapper py-4">
            <p className="text-center">
              Are you sure you want to delete this item?
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              className="btn_border_dark"
              onClick={() => setDeletePopup(false)}
            >
              Cancel
            </Button>
            <Button className="btn_primary ms-3" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Dialog>
      </>
    );
  },
);

export default ConfirmDeletePopup;
