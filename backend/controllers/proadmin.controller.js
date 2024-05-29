import Pro from "../models/pro.model.js";

const getAllPros = async (req, res) => {
    try {
      const pros = await Pro.find()
        .populate({
          path: 'location_id',
          select: 'city_name'
        })
        .populate({
          path: 'categories',
          select: 'name'
        })
        .select('first_name last_name email gender date_of_birth phone_number photo');
  
      const filteredPros = pros.map(pro => ({
        id: pro._id,
        name: `${pro.firstName} ${pro.lastName}`,
        categories: pro.categories.map(category => category.name),
        city: pro.location_id ? pro.location_id.city_name : 'N/A',
        email: pro.email,
        gender: pro.gender,
        date_of_birth: pro.date_of_birth,
        phone_number: pro.phone_number,
        photo: pro.photo,
      }));
  
      res.status(200).json( pros);
    } catch (error) {
      console.error('Error fetching professional data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

export {getAllPros}