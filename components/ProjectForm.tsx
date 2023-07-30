'use client' 
import { SessionInterface } from "@/common.types"
import Image from "next/image"
import {ChangeEvent} from 'react'
import FormField from "./FormField"
import { categoryFilters } from "@/constants"
import CustomMenu from "./CustomMenu"
import {useState} from 'react'
import Button from "./Button"
import { createNewProject, fetchToken } from "@/lib/actions"
import { useRouter } from "next/navigation"

  type Props = {
    type: String,
    session: SessionInterface,
  }
  
const ProjectForm = ({type, session}: Props) => {
  const router = useRouter()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true)

    const {token} = await fetchToken();

    try {
      if(type === 'create'){
        await createNewProject(form, session?.user?.id, token)

        router.push('/')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if(!file) return;

    if(!file.type.includes('image')) {
       return alert('Upload Images only!')
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange('image', result)
    }

  }

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({
      ...prevState, [fieldName]: value
    }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm ] = useState ({
    title: '',
    description: '',
    image: '',
    liveSiteUrl: '',
    githubUrl: '',
    category: '',
  })

  return (
    <form
    onSubmit={handleFormSubmit}
    className="flexStart form"
    >
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image ? 'Choose a thumbnail for your post' : 'Change thumbnail' }
        </label>
        <input 
        id="image"
        type="file"
        accept="/image/*"
        required={type === 'create'}
        className="form_image-input"
        onChange={handleChangeImage} 
        />
        {form.image && (
          <Image 
          src={form?.image}
          className="sm:p-10 object-contain z-20"
          alt="Project poster"
          fill
          />
        )}
      </div>

      <FormField
      title='Title'
      state={form.title}
      placeholder='flexxible'
      setState={(value) => handleStateChange('title', value)}
       />
        <FormField
      title='Description'
      state={form.description}
      placeholder='Showcase and discover amazing developer projects!'
      setState={(value) => handleStateChange('description', value)}
       />
        <FormField
      type="url"
      title='Website URL'
      state={form.liveSiteUrl}
      placeholder='https://yoursite.dev'
      setState={(value) => handleStateChange('liveSiteUrl', value)}
       />
        <FormField
      type="url"
      title='Github URL'
      state={form.githubUrl}
      placeholder='https://github.com/DevGod100'
      setState={(value) => handleStateChange('githubUrl', value)}
       />

       <CustomMenu 
        title='Category'
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)}
       />

       <div className="flexStart w-full">
        <Button
        title={
          isSubmitting 
          ? `${type === 'create' ? 'Creating' : 'Editing'}`
          : `${type === 'create' ? 'Create' : 'Edit'}`
        }
        type="submit"
        leftIcon={isSubmitting ? '' : '/plus.svg'}
        isSubmitting={isSubmitting}
        />
       </div>

    </form>
  )
}

export default ProjectForm