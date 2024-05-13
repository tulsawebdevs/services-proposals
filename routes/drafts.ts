import express from 'express';
import DraftsService from '../services/drafts';
import { SchemaValidationError } from 'slonik';
import { formatQueryErrorResponse } from '../helpers';
import { PendingDraft, DraftUpdate } from '../types/draft';

const router = express.Router();

router.get("/", async (req, res) => {
  try{
    const drafts = await DraftsService.index();
    return res.status(200).json(drafts);
  }catch(e){
    if (e instanceof SchemaValidationError) {
      return res.status(400)
        .json({message: 'Error fetching drafts: ' + formatQueryErrorResponse(e)})
    }

    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

/*
TEST DRAFT
 */

//   res.status(200).json({
//     list: [
//       {
//         title: "Test Draft",
//         summary: "This is a test draft",
//         description: "A draft for testing",
//         type: "Topic",
//         id: "1",
//         created: "2024-05-12T21:40:26.157Z",
//         updated: "2024-05-12T21:40:26.157Z",
//       },
//     ],
//   });
// });

router.post("/", async (req, res) => {
  const data = req.body;
  const validationResult = PendingDraft.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const draft = await DraftsService.store(data);
    return res.status(201).json({ success: true, draft: JSON.stringify(draft)});
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try{
    const draft = await DraftsService.show(id);
    return res.status(200).json(draft);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const validationResult = DraftUpdate.safeParse(data);
  if(!validationResult.success){
    return res.status(422).json({message: 'Invalid data', error: validationResult.error})
  }

  try{
    const result = await DraftsService.update(id, validationResult.data);
    res.status(200).json(result);
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DraftsService.destroy(id);
    return res.status(200).json({count: result.rowCount, rows:result.rows}); 
  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Server Error'})
  }
});

export default router;