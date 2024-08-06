import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createTask, deleteTask, updateTask, getTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';


export function TaskFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async data => {
    if (params.id) {
      await updateTask(params.id, data)
      toast.success('Tarea actualizada',{
        position: "botton-right",
        style: {
          background: "#101010",
          color: "#fff"
        }
      })
    } else {
      await createTask(data);
      toast.success('Tarea creada con éxito',{
      position: "botton-right",
      style: {
        background: "#101010",
        color: "#fff"
      }
    })
    }
    navigate('/task');
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const res = await getTask(params.id);
        console.log(res);
        setValue('title', res.data.title);
        setValue('description', res.data.description);
      }
    }
    loadTask();
  }, []);


  return (
    <div className='max-w-xl mx-auto'>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          placeholder='Title'
          {...register('title', { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        />
        {errors.title && <span>Title is required</span>}

        <textarea
          rows="3"
          placeholder='Description'
          {...register('description', { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        ></textarea>
        {errors.description && <span>Description is required</span>}

        <button
        className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
        >Save</button>
      </form>

      {
        params.id && (
          <div className='flex justify-end'>
            <button 
          className='bg-red-500 p-3 rounded-lg w48 mt-3'
            onClick={async () => {
              const acepted = window.confirm('Are you sure you want to delete this task?')
              if (acepted) {
                await deleteTask(params.id)
                toast.success('Tarea eliminada',{
                  position: "botton-right",
                  style: {
                    background: "#101010",
                    color: "#fff"
                  }
                })
                navigate('/task')
              }
            }}
          >
            Delete</button>
          </div>
        )}
    </div>
  );
}


