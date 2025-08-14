# Paper Assignment System

This system allows administrators to assign papers to reviewers for the conference management system.

## Features

- **Paper Assignment**: Assign multiple reviewers to papers with deadlines and notes
- **Assignment Management**: View current assignments and unassign reviewers if needed
- **Status Tracking**: Track paper status from submitted to under review
- **Permission Control**: Only users with 'paper-assign' permission can access the system

## Database Structure

### Tables

1. **papers** - Stores paper information
   - id, title, abstract, file_path, status, author_id, category_id, submission_date, review_deadline

2. **paper_assignments** - Links papers to reviewers
   - id, paper_id, reviewer_id, assigned_by, assigned_at, status, notes, deadline

3. **paper_reviews** - Stores reviewer feedback
   - id, paper_id, reviewer_id, assignment_id, technical_quality, originality, clarity, relevance, overall_recommendation, comments

### Models

- `Paper` - Main paper model with relationships to authors, categories, and assignments
- `PaperAssignment` - Manages the relationship between papers and reviewers
- `PaperReview` - Stores the actual review submissions from reviewers

## Installation & Setup

### 1. Run Migrations

```bash
php artisan migrate
```

### 2. Seed the Database

```bash
php artisan db:seed
```

This will create:
- Sample papers
- Sample paper assignments
- Required roles and permissions

### 3. Create Reviewers

Users need the 'Reviewer' role to be assigned papers:

```bash
php artisan tinker
```

```php
$user = User::find(1);
$user->assignRole('Reviewer');
```

## Usage

### Accessing the System

1. Navigate to `/paper-assignments` (requires 'paper-assign' permission)
2. The page shows all papers available for assignment
3. Click "Assign Reviewers" to assign reviewers to a specific paper

### Assigning Reviewers

1. Select a paper from the list
2. Choose one or more reviewers from the dropdown
3. Set a review deadline
4. Add optional notes for reviewers
5. Submit the assignment

### Managing Assignments

- View current assignments for each paper
- Unassign reviewers if needed
- Track assignment status (assigned, accepted, declined, completed)

## API Endpoints

- `GET /paper-assignments` - View assignment page
- `POST /paper-assignments/assign` - Assign reviewers to a paper
- `POST /paper-assignments/unassign` - Remove a reviewer assignment
- `GET /paper-assignments/{paperId}/assignments` - Get assignments for a specific paper

## Permissions

The system uses the following permission:
- `paper-assign` - Required to access and manage paper assignments

## File Structure

```
resources/js/Pages/Paper/
├── Index.jsx              # Main papers list
├── AssignPaper.jsx        # Paper assignment interface
└── CreateEdit.jsx         # Paper creation/editing

app/Http/Controllers/
├── PaperController.php           # Main paper management
└── PaperAssignmentController.php # Paper assignment logic

app/Models/
├── Paper.php              # Paper model
├── PaperAssignment.php    # Assignment model
└── PaperReview.php        # Review model
```

## Testing

Run the test suite to verify functionality:

```bash
php artisan test --filter=PaperAssignmentTest
```

## Customization

### Adding New Paper Statuses

1. Update the `status` enum in the papers migration
2. Update the `getStatusBadgeClass` function in `AssignPaper.jsx`
3. Update the Paper model's fillable array if needed

### Adding New Assignment Statuses

1. Update the `status` enum in the paper_assignments migration
2. Update the `getAssignmentStatusClass` function in `AssignPaper.jsx`

### Modifying Review Criteria

1. Update the paper_reviews migration to add/remove fields
2. Update the PaperReview model
3. Modify the review submission interface accordingly

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure user has 'paper-assign' permission
2. **No Reviewers Available**: Create users with 'Reviewer' role
3. **Migration Errors**: Check database connection and run `php artisan migrate:fresh --seed`

### Debug Mode

Enable debug mode in `.env` to see detailed error messages:

```
APP_DEBUG=true
```

## Support

For issues or questions, check the Laravel logs at `storage/logs/laravel.log` or contact the development team.
