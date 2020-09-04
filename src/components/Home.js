import React from 'react';
import { ProgressBar, Button, InputGroup, FormControl } from 'react-bootstrap';

import '../styles/Home.css'
const taskLength = 20;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      totalServer: 1,
      deleteServer: 0,
      runningTasks: [],
      waitingTasks: 0,
      timerRunning: false,
      taskToBeAdded: 1
    }
  }

  addServer = () => {
    let { totalServer, runningTasks, waitingTasks } = this.state;
    this.setState({
      totalServer: totalServer + 1,
      runningTasks: waitingTasks ? [...runningTasks, taskLength] : runningTasks,
      waitingTasks: waitingTasks ? waitingTasks - 1 : waitingTasks
    });
  }

  deleteTask = () => {
    this.setState({ waitingTasks: this.state.waitingTasks - 1 });
  }

  removeServer = () => {
    if (this.state.totalServer > 1) {
      if (this.state.runningTasks.length < this.state.totalServer) {
        this.setState({ totalServer: this.state.totalServer - 1 });
      }
      else {
        this.setState({ deleteServer: this.state.deleteServer + 1 })
      }
    }
  }

  setTask = (e) => {
    this.setState({ taskToBeAdded: parseInt(e.target.value) })
  }

  scheduleTask = () => {
    let { runningTasks, totalServer, waitingTasks, taskToBeAdded } = this.state;
    const toBeScheduled = Math.min(taskToBeAdded, totalServer - runningTasks.length);
    if (runningTasks.length < totalServer) {
      this.startNewTask(toBeScheduled);
      waitingTasks = waitingTasks - toBeScheduled;
    }
    if (waitingTasks + taskToBeAdded <= 0)
      waitingTasks = 0;
      waitingTasks = waitingTasks + taskToBeAdded;

    this.setState({ waitingTasks: waitingTasks });

  }

  startNewTask = (n) => {
    this.setState({ runningTasks: [...this.state.runningTasks, ...Array(n).fill(taskLength)] });
    if (!this.state.timerRunning) {
      this.setState({ timerRunning: true });
      const interval = setInterval(() => {
        let { runningTasks, totalServer, deleteServer, waitingTasks } = this.state;
        const newRunning = runningTasks.map(remainingTime => remainingTime - 1)
          .filter(remainingTime => remainingTime !== 0);
        if (newRunning.length !== runningTasks.length) {
          let maxServerToBeDeleted = Math.min(deleteServer, totalServer - newRunning.length);
          this.setState({
            totalServer: totalServer - maxServerToBeDeleted,
            deleteServer: deleteServer - maxServerToBeDeleted
          });
          if (waitingTasks > 0 && totalServer > newRunning.length) {
            const maxTaskToBeStarted = Math.min(waitingTasks, totalServer - newRunning.length);
            newRunning.push(Array(maxTaskToBeStarted).fill(0).map(() => taskLength));
            this.setState({ runningTasks: newRunning });
            this.setState({ waitingTasks: waitingTasks - maxTaskToBeStarted });
          } else if (newRunning.length === 0) {
            clearInterval(interval);
            this.setState({ timerRunning: false, runningTasks: [] });
          }
        }
        this.setState({ runningTasks: newRunning });
      }, 1000);
    }
  }

  render() {
    const { totalServer, deleteServer } = this.state;
    return (
      <div>
        <div className='title' >
          Task Manager
        </div>
        <div className='wrapperDiv'>
          <div className='serverButtons'>
            <Button style={{ marginRight: 10 }} onClick={() => this.addServer()}>
              Add Server
          </Button>
            <Button onClick={() => this.removeServer()} disabled={(totalServer - deleteServer) <= 1}>
              Remove Server
            </Button>
          </div>
          <div className='addTask'>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="tasks"
                aria-describedby="basic-addon2"
                type="number"
                value={this.state.taskToBeAdded}
                onChange={(e) => this.setTask(e)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => this.scheduleTask()}>Add Task</Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div>
          </div>
          <div className='taskWrapper'>
            <p>Total server available : {this.state.totalServer}</p>
            Running tasks:
            {this.state.runningTasks.map((remaining => (
              <div>
                <ProgressBar style={{ margin: 10 }} label={`00:${remaining}`} now={100 - (remaining / taskLength) * 100} />
              </div>
            )))}
            {(this.state.waitingTasks) &&
              <div>
                Waiting tasks:
                {Array(this.state.waitingTasks).fill(this.state.waitingTasks).map(() => (
                  <div className='waitingTasks' >
                    <div className='waitingkkTasks'>
                    </div>
                    <span className="close" onClick={() => this.deleteTask()}>
                    </span>
                  </div>
                ))}
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;