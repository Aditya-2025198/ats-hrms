"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';

const initialJobPosts = [
  {
    title: 'Frontend Developer',
    jobCode: '012',
    date: '11-06-2025',
    department: 'Engineering',
    vacancy: 4,
    status: 'Open',
    jd: '',
    supportingDoc: '',
    initiatedBy: 'Arjun Singh',
  },
  {
    title: 'Backend Developer',
    jobCode: '013',
    date: '12-06-2025',
    department: 'Engineering',
    vacancy: 2,
    status: 'Closed',
    jd: '',
    supportingDoc: '',
    initiatedBy: 'Nisha Rao',
  },
  {
    title: 'HR Manager',
    jobCode: '014',
    date: '13-06-2025',
    department: 'Human Resources',
    vacancy: 1,
    status: 'Hold',
    jd: '',
    supportingDoc: '',
    initiatedBy: 'Rahul Mehta',
  },
  {
    title: 'QA Engineer',
    jobCode: '015',
    date: '14-06-2025',
    department: 'Quality Assurance',
    vacancy: 3,
    status: 'Open',
    jd: '',
    supportingDoc: '',
    initiatedBy: 'Sneha Verma',
  },
];

export default function JobPostsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState(initialJobPosts);

  const handleDelete = (index: number) => {
    const updatedJobs = [...jobs];
    updatedJobs.splice(index, 1);
    setJobs(updatedJobs);
  };

  const handleEdit = (index: number) => {
  const jobToEdit = jobs[index];
  const newTitle = prompt('Edit job title:', jobToEdit.title);
  const newDept = prompt('Edit department:', jobToEdit.department);
  const newVacancy = prompt('Edit vacancy count:', jobToEdit.vacancy.toString());
  const newStatus = prompt('Edit status (Open, Closed, Hold):', jobToEdit.status);
  const newInitiatedBy = prompt('Edit initiated by:', jobToEdit.initiatedBy);

  if (
    newTitle !== null &&
    newDept !== null &&
    newVacancy !== null &&
    newStatus !== null &&
    newInitiatedBy !== null
  ) {
    const updatedJobs = [...jobs];
    updatedJobs[index] = {
      ...jobToEdit,
      title: newTitle,
      department: newDept,
      vacancy: parseInt(newVacancy),
      status: newStatus,
      initiatedBy: newInitiatedBy,
    };
    setJobs(updatedJobs);
  }
};


  const filteredJobs = jobs
    .filter((job) =>
      filter === 'All' ? true : job.status.toLowerCase() === filter.toLowerCase()
    )
    .filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.jobCode.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Posts</h2>
        <Button asChild>
          <Link href="/dashboard/jobs/new">+ New Post</Link>
        </Button>
      </div>

      <Input
        placeholder="Search by title, department, or job code"
        className="max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-4">
        {['All', 'Open', 'Closed', 'Hold'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
          >
            {status === 'Open' ? 'Active' : status}{' '}
            <span className="ml-1 text-sm">
              {status === 'All'
                ? jobs.length
                : jobs.filter((j) => j.status === status).length}
            </span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredJobs.map((job, index) => (
          <Card
            key={index}
            className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white space-y-2 text-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg text-blue-800">{job.title}</div>
                <div className="text-xs bg-gray-100 inline-block px-2 py-1 rounded-full mt-1">
                  Job Code: {job.jobCode}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(index)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">{job.department}</div>
            <div className="text-sm">Vacancy: {job.vacancy}</div>
            <div className="text-sm">Status: <span className="font-medium">{job.status}</span></div>
            <div className="text-xs text-gray-400">Date: {job.date}</div>

            <div className="flex items-center gap-2">
              <Label htmlFor={`jd-${index}`}>JD:</Label>
              <Input id={`jd-${index}`} type="file" className="w-full" />
            </div>

            <div className="flex items-center gap-2 justify-between">
              <span className="flex gap-2 items-center">
                <Label htmlFor={`doc-${index}`}>Supporting Document:</Label>
                <Input id={`doc-${index}`} type="file" className="w-full" />
              </span>
              <span className="text-xs text-gray-500">Initiated by: {job.initiatedBy}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
