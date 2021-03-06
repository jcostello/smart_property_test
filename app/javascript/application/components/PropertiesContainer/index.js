import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Button, Spinner, Form, FormGroup, Label, Input } from 'reactstrap'

import {
  fetchProperties,
  updateUnit,
  archiveProperty,
  restoreProperty,
  searchProperty
} from '../../store/actions'
import { selectAllProperties, selectLoading } from '../../store/selectors'
import PropertiesTable from './PropertiesTable'
import UnitModal from '../UnitModal'
import ConfirmModal from '../ConfirmModal'

const PropertiesContainer = props => {
  const [allProperties, setAllProperties] = useState([])
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [propertyId, setPropertyId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [propertyAchived, setPropertyArchived] = useState(null)
  const [searchField, setSearchField] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProperties())
  }, [])

  useEffect(() => {
    if (!props.loading) {
      setAllProperties(props.properties)
      setFiltered(filterProperties(allProperties))
    }
  }, [props.properties, props.loading])

  useEffect(() => {
    setFiltered(filterProperties(allProperties))
  }, [allProperties, filter])

  const filterProperties = (properties) =>
    properties.filter(property => property.archived == filter)

  const onFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const toggleModal = () => {
    if (openModal) {
      setPropertyId(null)
      setEditingItem(null)
    }
    setOpenModal(!openModal)
  }

  const onEditUnit = (id, index) => {
    const property = filtered.find(property => property.id === id)
    const unit = property.units[index]
    setPropertyId(property.id)
    setEditingItem(unit)
    toggleModal()
  }

  const onUpdateUnit = updatedUnit => {
    dispatch(updateUnit(propertyId, updatedUnit))
    toggleModal()
  }

  const toggleConfirmModal = () => {
    if (confirmModalOpen) {
      setPropertyArchived(null)
    }
    setConfirmModalOpen(!confirmModalOpen)
  }

  const onArchiveRestoreAction = id => {
    const property = filtered.find(property => property.id === id)
    setPropertyArchived(property)
    toggleConfirmModal()
  }

  const archiveOrRestore = () => {
    if (!propertyAchived.archived) {
      dispatch(archiveProperty(propertyAchived.id))
    } else {
      dispatch(restoreProperty(propertyAchived.id))
    }
    setPropertyArchived(null)
    toggleConfirmModal()
  }

  const onSearchChange = e => {
    setSearchField(e.target.value)
  }

  const onSearchSubmit = e => {
    e.preventDefault()
    dispatch(searchProperty(searchField))
  }

  const onSearchClear = e => {
    e.preventDefault()
    dispatch(fetchProperties())
  }

  return (
    <Container>
      <Form inline className="form-inline justify-content-between">
        <FormGroup>
          <Input
            type="text"
            className="mr-1"
            placeholder="Search properties"
            onChange={onSearchChange}
          />
          <Button color="primary" onClick={onSearchSubmit} disabled={searchField === ''}>Search</Button>
          <Button outline color="secondary" className="ml-1" onClick={onSearchClear}>Clear</Button>
        </FormGroup>
        <FormGroup>
          <Label className="mr-2" for="selectStatus">Show</Label>
          <select className="custom-select" onChange={onFilterChange} id="selectStatus">
            <option value={0}>Unarchived</option>
            <option value={1}>Archived</option>
          </select>
        </FormGroup>
      </Form>
      <div className="mb-3">
        <hr />
        <Link to="/new-property" className="btn btn-primary">
          <i className="fa fa-plus fa-fw"></i>
          Add property
        </Link>
      </div>
      {props.loading ? <Spinner />
        : <PropertiesTable properties={filtered} onEdit={onEditUnit} onArchiveOrRestore={onArchiveRestoreAction} />
      }
      <UnitModal
        data={editingItem}
        open={openModal}
        toggle={toggleModal}
        onSave={onUpdateUnit}
      />
      <ConfirmModal
        open={confirmModalOpen}
        toggle={toggleConfirmModal}
        onAction={archiveOrRestore}
      />
    </Container>
  )
}

const mapStateToProps = state => ({
  loading: selectLoading(state),
  properties: selectAllProperties(state)
})

export default connect(mapStateToProps)(PropertiesContainer)
