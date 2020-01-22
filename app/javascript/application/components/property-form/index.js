import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import './style.css'

import UnitItem from './unit-item'
import UnitModal from '../unit-modal'

const PropertyForm = (props) => {
  const [submitting, setSubmitting] = useState(false)
  const [currentData, setData] = useState(() => {
    const defaultData = props.data || {}
    return {
      name: '',
      description: '',
      address: '',
      units: [],
      ...defaultData
    }
  })
  const [openModal, setOpenModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)

  const toggleModal = () => {
    if (openModal) {
      setEditingIndex(null)
      setEditingItem(null)
    }
    setOpenModal(!openModal)
  }

  const setValue = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value)
  }

  const addUnit = (newUnit) => {
    setData(prev => {
      const units = [...prev.units, newUnit]
      return { ...prev, units }
    })
  }

  const updateUnit = (updatedUnit) => {
    setData(prev => {
      prev.units[editingIndex] = updatedUnit
      return { ...prev }
    })
  }

  const saveUnit = (unit) => {
    if (!editingItem) {
      addUnit(unit)
    } else {
      updateUnit(unit)
    }
   
    toggleModal()
  }

  const onUnitEdit = (index) => {
    const data = currentData.units[index]
    setEditingItem(data)
    setEditingIndex(index)
    toggleModal()
  }

  const onUnitsRemove = (index) => {
    setData(prev => {
      const units = [...prev.units]
      units.splice(index, 1)
      return { ...prev, units }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    props.onSubmit(currentData)
    setTimeout(() => setSubmitting(false), 3000)
  }

  return (
    <Container className="container">
      <h2>New Property</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Add property name"
            value={currentData.name}
            onChange={onInputChange}
            autoFocus
            required 
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            placeholder="Add a description"
            value={currentData.description}
            onChange={onInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input 
            type="text"
            name="address"
            id="address"
            placeholder="Add property address"
            value={currentData.address}
            onChange={onInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Units</Label>
          {currentData.units.map((unit, index) => (
            <UnitItem
              key={index}
              index={index}
              unit={unit}
              onEdit={onUnitEdit}
              onRemove={onUnitsRemove}
            />
          ))}
          <p className="add-unit" onClick={toggleModal}>+ Add new Unit</p>
          <UnitModal
            data={editingItem}
            open={openModal}
            toggle={toggleModal}
            onSave={saveUnit}
          />
        </FormGroup>
        <Button color="primary" size="md">Submit{submitting ? 'ting...' : ''}</Button>
      </Form>
    </Container>
  )
}

PropertyForm.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default PropertyForm