json.(property, :id, :name, :description, :address)
json.units do
  json.array! property.units.each do |unit|
    json.partial! 'api/v1/units/unit', unit: unit
  end
end