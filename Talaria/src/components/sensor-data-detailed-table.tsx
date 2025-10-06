"use client";

import { useState } from "react";
import { SensorReading } from "@/types/sensor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface SensorDataDetailedTableProps {
  data: SensorReading[];
  loading?: boolean;
  itemsPerPage?: number;
}

export function SensorDataDetailedTable({ data, loading, itemsPerPage = 10 }: SensorDataDetailedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReadings, setExpandedReadings] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading sensor data...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">No sensor data available</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const toggleReading = (id: string) => {
    setExpandedReadings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedReadings(new Set());
    } else {
      const allIds = new Set(currentData.map(r => r.id));
      setExpandedReadings(allIds);
    }
    setExpandAll(!expandAll);
  };

  // Calculate total samples across all readings
  const totalSamples = data.reduce((sum, reading) => sum + (reading.n || 50), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Detailed Sensor Readings ({data.length} readings, {totalSamples.toLocaleString()} total samples)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpandAll}
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Expand</TableHead>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Reading Timestamp</TableHead>
                <TableHead className="text-center">Sample #</TableHead>
                <TableHead className="text-center">Heart Rate</TableHead>
                <TableHead className="text-center">IR</TableHead>
                <TableHead className="text-center">Accel X</TableHead>
                <TableHead className="text-center">Accel Y</TableHead>
                <TableHead className="text-center">Accel Z</TableHead>
                <TableHead className="text-center">Gyro X</TableHead>
                <TableHead className="text-center">Gyro Y</TableHead>
                <TableHead className="text-center">Gyro Z</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((reading, readingIndex) => {
                const globalIndex = startIndex + readingIndex + 1;
                const isExpanded = expandedReadings.has(reading.id);
                const sampleCount = reading.n || 50;

                return (
                  <>
                    {/* Summary Row */}
                    <TableRow key={reading.id} className="bg-muted/50 font-medium hover:bg-muted/70">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReading(reading.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{globalIndex}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {new Date(reading.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{sampleCount} samples</Badge>
                      </TableCell>
                      <TableCell colSpan={8} className="text-center text-muted-foreground text-xs">
                        Click expand to see all {sampleCount} samples
                      </TableCell>
                    </TableRow>

                    {/* Expanded Detail Rows - Show all 50 samples */}
                    {isExpanded && reading.ax && reading.ax.length > 0 && (
                      <>
                        {Array.from({ length: sampleCount }).map((_, sampleIndex) => (
                          <TableRow key={`${reading.id}-${sampleIndex}`} className="text-xs">
                            <TableCell></TableCell>
                            <TableCell className="text-muted-foreground"></TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {sampleIndex === 0 && `${reading.client_ts_ms}ms`}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {sampleIndex + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant="outline" 
                                className={reading.bpm[sampleIndex] > 0 ? "bg-red-50" : "bg-gray-50"}
                              >
                                {reading.bpm[sampleIndex]} BPM
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-blue-50">
                                {reading.ir[sampleIndex]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.ax[sampleIndex].toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.ay[sampleIndex].toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.az[sampleIndex].toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.gx[sampleIndex].toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.gy[sampleIndex].toFixed(6)}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {reading.gz[sampleIndex].toFixed(6)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls at bottom */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing readings {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length}
            {expandedReadings.size > 0 && ` (${expandedReadings.size} expanded)`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
