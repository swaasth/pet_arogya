import { prisma } from '../src/lib/prisma'
import { breeds } from './breeds-data'

async function populateBreeds() {
  try {
    for (const breed of breeds) {
      await prisma.breeds.create({
        data: {
          name: breed.name,
          breedGroup: breed.group,
          size: breed.size,
          coatType: breed.coatType,
          activityLevel: breed.activityLevel,
          groomingNeeds: breed.groomingNeeds,
          lifeExpectancy: breed.lifeExpectancy,
          commonHealthIssues: breed.commonHealthIssues
        }
      })
    }
    
    console.log('Breeds populated successfully')
  } catch (error) {
    console.error('Error populating breeds:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateBreeds() 