import { Router } from 'express'

import {
    bulkCreateInstitutionController,
    createInstitutionController,
    deleteInstitutionController,
    getInstitutionByIdController,
    getInstitutionsController,
    getInstitutionsSimpleController,
    updateInstitutionController,
} from './institution.controller'

const institutionRoutes = Router()

/**
 * Endpoint Master Data Institusi
 * Digunakan untuk mengelola daftar Universitas, Sekolah, dan Lembaga Pendidikan
 */

// 1. Membuat institusi baru
// POST /api/institutions
institutionRoutes.post('/', createInstitutionController)

// 2. Bulk create institusi (Input banyak data sekaligus untuk migrasi/setup awal)
// POST /api/institutions/bulk
institutionRoutes.post('/bulk', bulkCreateInstitutionController)

// 3. Mendapatkan semua institusi (Mendukung query: ?page=1&limit=10&search=...&type=...&isActive=true)
// GET /api/institutions
institutionRoutes.get('/', getInstitutionsSimpleController)

// 4. Mendapatkan detail institusi berdasarkan ID
// GET /api/institutions/:id
institutionRoutes.get('/:id', getInstitutionByIdController)

// 5. Memperbarui data institusi berdasarkan ID
// PATCH /api/institutions/:id
institutionRoutes.patch('/:id', updateInstitutionController)

// 6. Menghapus institusi berdasarkan ID
// DELETE /api/institutions/:id
institutionRoutes.delete('/:id', deleteInstitutionController)

export default institutionRoutes
